export class UsefulFunction {
    static getIndexOfArrayMax(arrayOfNumbers) {
        let indexOfMax = 0;
        let max = arrayOfNumbers[0];
        for (let i =0 ; i < arrayOfNumbers.length; i++) {
            let number = arrayOfNumbers[i];
            
            if (number > max) {
                max = number;
                indexOfMax = i;
            }
        }
        if (indexOfMax == -1) return undefined;
        return indexOfMax;
    }
    static isMixedUpArraysEqual(array1,array2){
        array1 = [...array1];
        array2 = [...array2];
        for (let i=array1.length-1; i >=0 ;i--) {
            for (let j=array2.length-1; j >=0 ;j--) {
                if (array1[i] === array2[j]) {
                    array1.splice(i,1);
                    array2.splice(j,1);
                }
            }
        }
        return (array1.length ==0 && array2.length ==0);
    }
    static isThereValueGreaterThanN(array,n){
        for (const value of array) {
            if (value > n) {
                return true;
            }
        }
        return false;
    }
    // source - chatgpt
    static noDuplicates = (arr) => [...new Set(arr)];

    static combineArrays(arrayOfArrays){
        let outputArray = [];
        for (const array of arrayOfArrays) {
            for (const object of array) {
                outputArray.push(object);
            }
        }
        return outputArray;
    }
    static arrayOfIndices(n) {
        let array = [];
        for (let i =0 ; i < n; i ++) {
            array.push(i);
        }
        return array;
    }
    static addToMap(map, key, value) {
        if (!map.has(key)) {
          map.set(key, []); // Initialize with an empty array if key does not exist
        }
        map.get(key).push(value); // Push new value into the array
        return map;
    }
    static incrementMap(map,key){
        if (!map.has(key)) throw new Error("Supplied map is bad");
        map.set(key,map.get(key)+1)
    }
    
    static isInArray(array,value) {
        for (let i =0; i < array.length;i++) {
            if (array[i] === value) return true;
        }
        return false;
    }
    
    static getCounterClockwiseMove(hashGraph,currentNode) {
        let possibleNextMoves = [...hashGraph.get(currentNode)];
        if(possibleNextMoves.length == 1) {
            currentNode = possibleNextMoves[0];
            return currentNode;
        }
        for (let i =possibleNextMoves.length-1; i >= 0;i--) {
            if (!this.doesMoveExistElsewhere(hashGraph,currentNode,possibleNextMoves[i])) continue;

            possibleNextMoves.splice(i,1);

        }
        return possibleNextMoves[0];
    }
    static doesMoveExistElsewhere(map,valueToFind,keyToCheckUnder){
        if (map.has(valueToFind) == false) throw new Error("Could not find node");
        return this.isInArray(map.get(keyToCheckUnder),valueToFind);
    }

    static doesKeyHaveSpecificValue(hashGraph,key,specificValue) {
        let arrayFromKey = hashGraph.get(key);
        for (let i =0; i < arrayFromKey.length ; i ++) {
            if (arrayFromKey[i] === specificValue) return true;
        }
        return false;
    }
    
    static findNodeThatHasSpecificNodeAsConnection(hashGraph,startingNode,specificNode,lastNode) {
        let connectionsToStartingNode = hashGraph.get(startingNode);
        
        for (let i =0; i < connectionsToStartingNode.length;i++) {
            if (connectionsToStartingNode[i] === lastNode) continue;
            
            if (!this.doesKeyHaveSpecificValue(hashGraph,connectionsToStartingNode[i],specificNode)) {
                continue;
            }

            return connectionsToStartingNode[i];
        }
        return false;
    }

    static runSearchMovementAroundCenter(hashGraph,start,current,center,lastNode){
        let numberOfIterations = 100;
        let iteration = 1;
        let currentNode = current;
        let nodeToCheck = center;
        let startingNode = start;
        while(currentNode != startingNode) {
            iteration++;
            if (iteration > numberOfIterations) {
                // throw new Error("Upper limit of iterations reached")
                return false;
            }
            if (currentNode == false) {
                return false;
            } 
            let temp = currentNode;
            currentNode = this.findNodeThatHasSpecificNodeAsConnection(hashGraph,currentNode,nodeToCheck,lastNode);
            
            lastNode = temp;
        }
        return true;
    }
    static isNodeSurroundedByNodes(hashGraph,nodeToCheck,numberOfIterations) {
        
        let connectionsToNode = hashGraph.get(nodeToCheck);
        
        let iteration = 1;
        numberOfIterations = 100;
        let result = [];
        for (let i =0; i < connectionsToNode.length;i++) {
        
            let startingNode = connectionsToNode[i];
            let lastNode = startingNode;
            let currentNode = this.findNodeThatHasSpecificNodeAsConnection(hashGraph,startingNode,nodeToCheck,lastNode);
            let pathwayConnects = this.runSearchMovementAroundCenter(hashGraph,startingNode,currentNode,nodeToCheck,lastNode)
            result.push(pathwayConnects);
        }
        return this.isInArray(result,true)
        
        
        

    }

    static getOutsideNode(hashGraph) {
        for (const key of hashGraph.keys()) {
            
            if (this.isNodeSurroundedByNodes(hashGraph,key)) continue;
            
            return key; 
        }
    }
    static randomIntBetween(x,y){
        let change = Math.round(Math.random() *(y-x));
        return x + change;
    }
    static multiplyArray(array,number){
        let newArray = [];
        for (const element of array) {
            newArray.push(element*number);
        }
        return newArray;
    }
    static divideArray(array,number){
        if (number ==0) throw new Error("Divisor is 0, critical failure, cannot divide by zero!");
        let newArray = [];
        for (const element of array) {
            newArray.push(element/number);
        }
        return newArray;
    }
    static elementWiseMultiplication(array1,array2){
        if (array1.length != array2.length) throw new Error("Array lengths are different!");
        let productArray = [];
        for (let i =0 ; i < array1.length;i ++) {
            productArray.push(array1[i] * array2[i]);
        }
        return productArray;
    }
    static randomP5Color(){
        return "rgb(" + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + "," + Math.round(Math.random()*255) + ")";
    }

    static getNodesOnOutsideOfCounterClockwiseGraph(hashGraph,numberOfIterations) {
        if (numberOfIterations == undefined) {
            numberOfIterations = 15;
        }
        let iterationNumber = 1;
        let map = new Map(hashGraph);

        
        let goalIndex = this.getOutsideNode(hashGraph);
        let currentIndex = this.getCounterClockwiseMove(hashGraph,goalIndex);
        let pathway = [];


        while (iterationNumber < numberOfIterations && currentIndex != goalIndex) {
            iterationNumber++;
            let nextMove = this.getCounterClockwiseMove(hashGraph,currentIndex);
            pathway.push(currentIndex);
            currentIndex=nextMove;
            

        }
        pathway.push(currentIndex);

        return pathway;
    }
    static addElementsToArray(array,elements){
        for (const element of elements) {
            array.push(element);
        }
    }


    
}