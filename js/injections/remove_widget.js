LGraphNode.prototype.removeWidget = function(slot) {
    this.widgets.splice(slot, 1);
    this.setDirtyCanvas(true, true);
};