/**
 * Approximate landing coordinate for the x axis
 */
node_columns = {
    "stage": 2,
    "orchestrator": 3,
    "problem_data": 1,
    "solver_settings": 1,
    "linear_solver_settings": 0,
    "model_import_settings": 0,
} 

class KratosProblemParametersBuilder {
    constructor(graph, data) {
        this.graph = graph;
        this.data = data;
        this.nodes = {};
        this.ppnodes = [
            "problem_data",
            "solver_settings",
            "linear_solver_settings",
            "model_import_settings",
            "material_import_settings"
        ];
        this.node_y_stack = {}

        console.log(graph);
    }

    /**
     * Restores the values of the node and its widgets from the ProjectParameters
     * @param {LGraphNode} node 
     * @param {String} key 
     * @param {*} value 
     */
    loadFromProjectParameters = function(node, key, value) {
        // Build a reverse map of properties associated witg the widgets
        let widget_map = Object.fromEntries( 
            Object.entries(node.widgets || {})
            .filter(w => w[1].options && w[1].options.property )
            .map( w => [w[1].options.property, w[1]])
        );

        // Iterate over all keys and assign those that are not objects
        for (let [_key, _value] of Object.entries(value)) {
            if (typeof(_value) != "object") {
                if (_key in node.properties) node.properties[_key]  = _value; // Property
                if (_key in widget_map)      widget_map[_key].value = _value; // Widget
            }
        }
    }

    /**
     * Returns de type of the node based on the key and value of the json parameter being parsed.
     * Ideally we should build this automatically from the node name, but for now we will hardcode it.
     * @param {*} key Key of the json parameter being parsed
     * @param {*} value content of the json parameter being parsed
     * @param {String} returns The node type to be created or undefined if it cannot be deduced
     */
    deduceNode(key, value) {
        switch (key) {
            case "problem_data":                            return "Analysis stages/Components/ProblemData";
            case "solver_settings": 
            console.log(value)
                if (value.solver_type == "fractional_step") return "Solvers/Fluid dynamics/NavierStokesSolverFractionalStep";
                if (value.solver_type == "monolithic")      return "Solvers/Fluid dynamics/NavierStokesSolverMonolithic";
                
                // This should be unreachable
                warn(`Trying to create a "${key}" with "solver_type":"${value.solver_type}" which is not registered`);
                return undefined;
            case "linear_solver_settings":
                if (value.solver_type == "amgcl")           return "Solvers/Linear Solvers/Serial/AMGCL";
                if (value.solver_type == "bicgstab")        return "Solvers/Linear Solvers/Serial/BICGSTAB";
                if (value.solver_type == "cg")              return "Solvers/Linear Solvers/Serial/CG";
                if (value.solver_type == "LinearSolversApplication.sparse_lu") 
                                                            return "Solvers/Linear Solvers/Serial/SparseLU";

                warn(`Trying to create a "${key}" with "solver_type":"${value.solver_type}" which is not registered`);
                return undefined;
            case "model_import_settings":                   return "Solvers/Components/ModelImportSettings";
            case "material_import_settings":                return "Solvers/Components/MaterialImportSettings";
            default: 

                // This is most liekey reachable
                warn(`Trying to create a "${key}" which is not registered`);
                return undefined;
        };

        // This should be unreachable
        return undefined;
    }

    deduceNodeFromNodeInfo(key, value) {
        
    }

    /**
     * Calcaulte the position of a node based on its key and the node itself
     * @param {*} key 
     * @param {*} node 
     */
    calculateNodePosition(key, node) {
        let x_coord = node_columns[key] || 0;

        node.pos[0] = x_coord * (LiteGraph.NODE_WIDTH + LiteGraph.NODE_WIDTH_MARGIN);
        node.pos[1] = this.node_y_stack[x_coord] || 100;

        this.node_y_stack[x_coord] = (this.node_y_stack[x_coord] || 100) + node.size[1] + LiteGraph.NODE_WIDTH_MARGIN;
    }
    
    /**
     * Process a node based on its Json data.
     * Due to some particularities of the Kratos JSON structure, Stage and Orchestrator are currently handled spearatly by:
     * - processOrchestrator
     * - processStage
     * @param {String} key 
     * @param {*} value 
     */
    processNodeJson(key, value, prev_node) {
        let node_type = this.deduceNode(key, value);

        if (node_type) {
            let node = LiteGraph.createNode(node_type);

            // Calculate the node position
            this.calculateNodePosition(key, node);

            // Store the nodes in the builder to be able to make the links later
            this.nodes[key] = node;
    
            // Load the ProjectParameters into the node
            this.loadFromProjectParameters(node, key, value);
    
            // Add node to the graph
            this.graph.add(node, true);

            // If we come from a previous node, we need to link them
            let target_slot = prev_node.inputs.findIndex(slot => slot.type == key);
            if (target_slot != -1) {
                node.connect(0, prev_node, target_slot);
            }
    
            // Process the rest of the data
            for (let [_key, _value] of Object.entries(value)) {
                if (this.ppnodes.indexOf(_key) != -1) {
                    this.processNodeJson(_key, _value, node);
                }
            }
        }
    }
    
    /**
     * Process the ProblemParameters JSON data to build the Orhcestrator node
     */
    processOrchestrator() {
        let orchestrator_type = ["Orchestrators",this.data.orchestrator.name.split(".").slice(-1)].join("/");
        let orchestrator_node = LiteGraph.createNode(orchestrator_type);

        // Calculate the node position
        this.calculateNodePosition("orchestrator", orchestrator_node);

        // Store the nodes in the builder to be able to make the links later
        this.nodes["orchestrator"] = orchestrator_node;

        // Add node to the graph
        this.graph.add(orchestrator_node, true);
    }

    /**
     * Process the ProblemParameters JSON data to build all the stage nodes
     */
    processStages() {
        for (let [name, value] of Object.entries(this.data.stages)) {
            this.processStage(name, value);
        }
    }

    /**
     * Process the ProblemParameters JSON data to build a Stage node
     */
    processStage(name, data) {
        let stage_type = [
            "Analysis stages",
            data.stage_settings.analysis_stage
                .split(".")
                .slice(-1)[0]
                // We need to change from Kratos script name (snake_case) to the node name (CamelCase)
                .split("_")
                .map(stage_name => stage_name.charAt(0).toUpperCase() + stage_name.slice(1))
                .join("")        
        ].join("/");

        let stage_node = LiteGraph.createNode(stage_type);

        stage_node.pos[0] = node_columns["stage"] * (LiteGraph.NODE_WIDTH + LiteGraph.NODE_WIDTH_MARGIN);

        // Load the ProjectParameters into the node
        stage_node._name.value = name;
        this.loadFromProjectParameters(stage_node, name, data);

        // Store the nodes in the builder to be able to make the links later
        this.nodes["stageSettings"] = stage_node;

        // Add node to the graph
        this.graph.add(stage_node, true);

        // Process the rest of the data
        for (let [_key, _value] of Object.entries(data.stage_settings)) {
            if (this.ppnodes.indexOf(_key) != -1) {
                this.processNodeJson(_key, _value, stage_node);
            }
        }
    }
}
    
/**
 * Configure a graph from a JSON string
 * @method configure
 * @param {String} str configure a graph from a JSON string
 * @param {Boolean} returns if there was any error parsing
 */
LGraph.prototype.configure_project_parameters = function(data) {

    let builder = new KratosProblemParametersBuilder(this, data);

    builder.processOrchestrator();
    builder.processStages();
};