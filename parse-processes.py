import os
from pathlib import Path
import ast
import json
from pprint import pprint
from lxml import etree, html


def get_processes_path(basepath):
    return basepath.glob("**/*_process.py")


def get_output_processes_path(basepath):
    output_processes = [
        "csv_points_output_process.py",
        "gid_output_process.py",
        "json_output_process.py",
        "line_output_process.py",
        "multiple_points_output_process.py",
        "point_output_process.py",
        "tikz_output_process.py",
        "unv_output_process.py",
        "vtk_output_process.py",
        "FluidDynamicsApplication/cfl_output_process.py",
        "FluidDynamicsApplication/compute_body_fitted_drag_process.py",
        "FluidDynamicsApplication/compute_drag_process.py",
        "FluidDynamicsApplication/compute_embedded_drag_process.py",
        "FluidDynamicsApplication/compute_pressure_coefficient_process.py",
        "FluidDynamicsApplication/flow_output_process.py",
        "FluidDynamicsApplication/response_function_output_process.py",
        "StructuralMechanicsApplication/eigen_solution_input_process.py",
    ]
    return (basepath / x for x in output_processes)


def update_index(paths):
    root = html.parse("index.template.html")
    body = root.find(".//body")
    comm = etree.Comment(f"Automatically parsed processes and output-processes nodes")
    comm.tail = "\n    "
    body.append(comm)
    for path in paths:
        script = etree.Element("script")
        script.attrib["type"] = "text/javascript"
        script.attrib["src"] = f"{path}"
        script.tail = "\n    "
        body.append(script)
    index_str = html.tostring(root, pretty_print=True)
    with open("index.html", "wb") as f:
        f.write(index_str)


def create_process_node(path, processtype, descr, iparams, oparams):
    name = path.stem  # apply_inlet_process
    title = " ".join(name.split("_")).title()  # Apply Inlet Process
    fname = "".join(title.split())  # ApplyInletProcess
    group = path.parents[0].name
    if "KratosMultiphysics" in group:
        module = group
    else:
        module = f"{path.parents[1].name}.{group}"
    props = json.dumps(oparams, indent=4)
    fprops = "\n    ".join(props.split("\n"))
    processlabel = "".join(" ".join(processtype.split("_")).title().split())


    # Write funtion definition
    lines = f"function {fname}() {{" + "\n"
    for mp in iparams:
        lines += f'    this.addInput("{mp}", "string");' + "\n"
    lines += f'    this.addOutput("{processlabel}", "{processtype}");' + "\n"
    lines += f"    this.properties = {fprops}" + "\n"
    lines += "    this.size = this.computeSize();" + "\n"
    lines += "};" + "\n"
    lines += "\n"

    # Write "onExecute"
    lines += f"{fname}.prototype.onExecute = function() {{" + "\n"
    lines += "    output = {" + "\n"
    lines += f'        "python_module": "{name}",' + "\n"
    lines += f'        "kratos_module": "{module}"' + "\n"
    lines += "    }" + "\n"
    lines += '    output["Parameters"] = this.properties' + "\n"
    for i, mp in enumerate(iparams):
        lines += f'    output["Parameters"]["{mp}"] = this.getInputData({i})' + "\n"
    lines += "    this.setOutputData(0, output);" + "\n"
    lines += "};" + "\n"
    lines += "\n"

    # Write title, description, registration, ...
    lines += f'{fname}.title = "{title}";' + "\n"
    lines += "\n"
    lines += f'{fname}.desc = "{descr}";' + "\n"
    lines += "\n"
    lines += f'LiteGraph.registerNodeType("{processtype.upper()}/{group}/{title}", {fname});\n'

    return lines


def get_node_params(params):
    descr = params.pop("help", "N/A")
    ip = []
    op = {}
    for k, v in params.items():
        # heuristics for the processing of parameters
        # . remove obsolete params
        if "computing_model_part_name" in k:
            continue
        if "model_part" in k:
            ip.append(k)
        else:
            op[k] = v
    return descr, ip, op


def get_children_by_type(node, ntype):
    #  return a list of children nodes if the requested type
    children = []
    for n in ast.iter_child_nodes(node):
        if isinstance(n, ntype):
            children.append(n)
    return children


def get_child_by_type_and_name(nodes, ctype, name):
    #  return the requested node (by name)
    for node in ast.iter_child_nodes(nodes):
        if isinstance(node, ctype):
            if name in node.name:
                return node


def get_default_params_from_process(code):
    # HEURISTICA:
    # . Busca el argumento del "return" de la funcion "Factory"
    # . Busca la clase con el nombre del return en "Factory"
    # . Busca "__init__"
    # . Buscar el nombre del argumento de "ValidateAndAssingDefaults" (default_settings)
    # . Busca los settings por dafault y saca el string
    main_node = ast.parse(code)
    node = get_child_by_type_and_name(main_node, ast.FunctionDef, "Factory")
    node = get_children_by_type(node, ast.Return)[0]
    class_name = node.value.func.id
    node = get_child_by_type_and_name(main_node, ast.ClassDef, class_name)
    init_node = get_child_by_type_and_name(node, ast.FunctionDef, "__init__")
    # print(f"Found init: {init_node.name}")
    varname = init_node.args.args[-1].arg
    # print(f"Found variable name: {varname}")

    call_nodes = []
    for node in get_children_by_type(init_node, ast.Expr):
        call_nodes.extend(get_children_by_type(node, ast.Call))
    for n in call_nodes:
        try:
            if varname in n.func.value.id:
                defaults = n.args[0].id
        except:
            pass
    # print(f"Found default settings name: {defaults}")

    # PARSE:
    # default_settings = KratosMultiphysics.Parameters("""{...}""")
    # AST:
    # Module(
    #     body=[
    #         Assign(
    #             targets=[P
    #                 Name(id='default_settings', ctx=Store())],
    #             value=Call(
    #                 func=Attribute(
    #                     value=Name(id='KratosMultiphysics', ctx=Load()),
    #                     attr='Parameters',
    #                     ctx=Load()),
    #                 args=[
    #                     Constant(value='{...}')],
    #                 keywords=[]))],
    #     type_ignores=[])

    for node in get_children_by_type(init_node, ast.Assign):
        try:
            if defaults in node.targets[0].id:
                return node.value.args[0].value
        except:
            return "{}"

def parse_processes(paths, processtype):
    notparsed = []
    parsed = []
    for p in sorted(paths):

        # Files to skip
        if "python_process.py" in p.name:
            continue

        try:
            code = p.read_text()
        except (FileNotFoundError):
            continue
        try:
            params = json.loads(get_default_params_from_process(code))
            if not params:
                notparsed.append(p)
                print(f"NOT PARSED: {p.parents[0].name} {p.name}")
                continue
            descr, i_params, o_params = get_node_params(params)

            node_code = create_process_node(p, processtype, descr, i_params, o_params)
            opath = Path(f"js/nodes/{processtype.upper()}/{p.parents[0].name}")
            opath.mkdir(parents=True, exist_ok=True)
            ppath = opath / f"{p.stem}.js"
            ppath.write_text(node_code)
            parsed.append(str(ppath))

        # DEBUG
        except (AttributeError, IndexError):
            notparsed.append(p)
            print(f"NOT PARSED except: {p.parents[0].name} {p.name}")
    return parsed, notparsed


if __name__ == "__main__":
    kpath = [Path(x) for x in os.getenv("PYTHONPATH").split(":") if "Kratos/bin" in x]
    bpath = kpath[0] / "KratosMultiphysics"

    p_aproc = set(get_processes_path(bpath))
    p_oproc = set(get_output_processes_path(bpath))
    p_pproc = p_aproc.difference(p_oproc)

    gnotparsed = []
    gparsed = []
    parsed, notparsed = parse_processes(p_pproc, "process")
    gparsed.extend(parsed)
    gnotparsed.extend(notparsed)
    parsed, notparsed = parse_processes(p_oproc, "output_process")
    gparsed.extend(parsed)
    gnotparsed.extend(notparsed)


    update_index(gparsed)

    # DEBUG: write file with not-parsed processes
    line = ""
    for p in gnotparsed:
        line += f"{str(p.parents[0].name)} {str(p.name)}\n"
    Path("not-parsed.dat").write_text(line)

