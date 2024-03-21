function is_litegraph_json(data) {
    return data.last_node_id && data.last_link_id && data.nodes;
}

function is_kratos_json(data) {
    return data.orchestrator && data.stages;
}

function load_kratos_json(data) {
    return 0;
}