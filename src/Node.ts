import P5 from "p5";
import p5 from "p5";


export enum NodeType {
    Source,
    Router,
    Sink,
}

export class Node {
    p5: P5;
    x: number;
    y: number;
    type: NodeType;
    power: number;
    color: P5.Color
    transmissionCost: number;
    incomingNodes: Set<Node>;
    target: Node;


    constructor(p5: P5, x: number, y: number, power: number, type: NodeType) {
        this.p5 = p5;
        this.x = x;
        this.y = y
        this.type = type;
        this.power = power
        if (this.type == NodeType.Source) {
            this.color = this.p5.color(255, 0, 0, 127)
        }
        else if (this.type == NodeType.Router) {
            this.color = this.p5.color(0, 255, 0, 125)
        }
        else if (this.type == NodeType.Sink) {
            this.color = this.p5.color(0, 0, 255, 125)
        }
        else {
            console.log(`Nodetype not defined`)
        }

    }

    get diameter(): number {
        return 51
    }

    addIncoming(inNode: Node) {
        this.incomingNodes.add(inNode)
    }
    setTarget(outNode: Node) {
        this.target = outNode
    }

    
    distanceAbs(targetNode: Node) {
        return Math.abs(this.p5.dist(this.x, this.y, targetNode.x, targetNode.y))
    }

    etx(targetNode : Node){
        //  df : forward delivery ratio (prob that data packet successfully arrives)
        //  dr : backwards delivery ratio (prob that ack is successfull)
        if(this.power == 0 || targetNode.power == 0){
            return 10000 //max safe
        }
        let distanceScalingFactor = 0.05
        let df = Math.exp(-distanceScalingFactor*this.distanceAbs(targetNode)/this.power)
        let dr = Math.exp(-distanceScalingFactor*this.distanceAbs(targetNode)/targetNode.power)
        return 1/(df*dr+Number.EPSILON)
    }

    posInsideNode(x, y) {
        if (Math.abs(this.p5.dist(this.x, this.y, x, y)) < this.diameter) {
            return this
        }
        return false


    }
    onClick(x, y) {
        return true
    }

    increasePower(p: number) {
        this.power += Math.round(-p / 10)
        this.power = Math.max(Math.min(this.power, 100), 20)
    }

    draw() {
        const p5 = this.p5; // just for convenience 

        p5.push();

        p5.strokeWeight(2)
        p5.stroke(255, 255, 255)
        if (this.target) {
            let angle = Math.atan2(this.target.y-this.y, this.target.x-this.x)
            p5.line(this.x + this.diameter/2*Math.cos(angle) , this.y + this.diameter/2*Math.sin(angle) ,
                    this.target.x-this.target.diameter/2*Math.cos(angle), this.target.y-this.target.diameter/2*Math.sin(angle))
        }
        
        p5.fill(this.color)
        p5.strokeWeight(1)
        p5.stroke(0,0,0,125)
        p5.ellipseMode(p5.CENTER)
        p5.circle(this.x, this.y, this.diameter);

        p5.fill(0);
        p5.strokeWeight(0)
        p5.textSize(10)
        p5.rectMode(p5.CENTER);
        p5.textAlign(p5.CENTER, p5.CENTER)
        p5.text(String(Math.round(this.power)), this.x, this.y+this.diameter/4, this.diameter/2,this.diameter/4)
        p5.text(String(Math.round(100*this.transmissionCost)/100), this.x, this.y-this.diameter/4, this.diameter/2,this.diameter/4)

        p5.strokeWeight(1)
        p5.stroke(0,0,0,125)
        p5.line(this.x-this.diameter/2, this.y, this.x+this.diameter/2, this.y)

       
        p5.pop();
    }
}
