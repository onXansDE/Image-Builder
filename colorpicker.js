Array.min = function( array ){
    return Math.min.apply( Math, array );
};

module.exports = {
    getColourDistance(colour1,colour2) {
      return Math.pow((colour2.r-colour1.r) * 0.1   ,2) 
      + Math.pow((colour2.g-colour1.g)      * 0.1   ,2)
      + Math.pow((colour2.b-colour1.b)      * 0.1   ,2)
    },
    getClosestColor(color1, colors) {
        var returns;
        var distances = new Array();
        colors.forEach(element => {
            var dist = this.getColourDistance(color1,element.color);
            element.distance = dist;
            distances.push(dist);
        });
        
        var smallest = distances.sort((a, b) => a - b);
        colors.forEach(element => {
            if(element.distance == smallest[0]) {
                returns = element;
            }
        });
        return returns;
    }
}