import os
from pathlib import Path
import ast
import json
from pprint import pprint


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
    #print(f"Found init: {init_node.name}")
    varname = init_node.args.args[-1].arg
    #print(f"Found variable name: {varname}")

    call_nodes = []
    for node in get_children_by_type(init_node, ast.Expr):
        call_nodes.extend(get_children_by_type(node, ast.Call))
    for n in call_nodes:
        try:
            if varname in n.func.value.id:
                defaults = n.args[0].id
        except:
            pass
    #print(f"Found default settings name: {defaults}")

    # PARSE:
    # default_settings = KratosMultiphysics.Parameters("""{...}""")
    # AST:
    # Module(
    #     body=[
    #         Assign(
    #             targets=[
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
      
    assign_nodes = []
    for node in get_children_by_type(init_node, ast.Assign):
        try:
            if defaults in node.targets[0].id:
                return node.value.args[0].value
        except:
            return "{}"


BASE = [x for x in os.getenv('PYTHONPATH').split(":") if "Kratos/bin" in x][0]
PATHS = (Path(BASE) / "KratosMultiphysics").glob("**/*_process.py")

DATA = []
for p in PATHS:
    print(f"DEBUG: -----> {p}:")
    print(p.name)
    code = p.read_text()
    dparams = get_default_params_from_process(code)
    print(dparams)
    params = json.loads(get_default_params_from_process(code))
    #try:
    #    dparams = get_default_params_from_process(code)
    #    print(dparams)
    #    params = json.loads(get_default_params_from_process(code))
    #except:
    #    print(p)
    #    break
    description = params.pop("help", "N/A")

    process_data = {
            "group": p.parents[0].name,
            "name": " ".join(p.stem.split("_")[:-1]),
            "description": description,
            "parameters": params,
            }
    
    DATA.append(process_data)
    pprint(process_data)
    print()
    #break

#pprint(DATA)

