/**
 * Extends the LGraph.prototype.remove function with widget treatment
 * @method remove
 * @param {LGraphNode} node the instance of the node
 */

const LGraphRemove = LiteGraph.LGraph.prototype.remove;

LGraph.prototype.remove = function(node) {
    LGraphRemove.apply(node);

    // Remove widgets from the node
    if (node.widgets) {
        for (let w in node.widgets) {
            node.widgets[w].onRemoved?.();
        }
    }
};