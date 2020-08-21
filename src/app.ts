
import P5 from "p5/lib/p5.min.js";
// import "p5/lib/addons/p5.dom";
import "./styles.scss";


// DEMO: A sample class implementation
import {Node, NodeType} from "./Node";

 


class App {
	private nodes: Array<Node> = [];
	private mouseMoveFlag: boolean = false
	private mouseMovePrevPos: P5.Vector;
	private mouseMoveNode: Node;
	public sketch = (p5: P5) => {
		p5.disableFriendlyErrors = true
		p5.preload = () => {
		}
		p5.setup = () => {
			// p5.noLoop()
			p5.frameRate(60)
			const canvas = p5.createCanvas(1200, 800);
			canvas.parent("app");
			canvas.mouseClicked((e) => this.onMouseClickCanvas(e, p5))
			canvas.mouseMoved((e) => this.onMouseMoveCanvas(e, p5))
			canvas.mouseReleased((e) => this.onMouseRelease(e, p5))
			canvas.mousePressed((e) => this.onMousePressedCanvas(e, p5))
			canvas.doubleClicked((e) => this.onMouseDClickCanvas(e, p5))
			canvas.mouseWheel((e) => this.onMouseWheelCanvas(e, p5))

			p5.background(127);
			for (let i = 1; i <= 1; i++) {
				let pos = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
				let power = Math.round(p5.random(20, 50))
				this.nodes.push(new Node(p5, pos.x, pos.y, power, NodeType.Source));
			}
			for (let i = 1; i <= 3; i++) {
				let pos = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
				let power = Math.round(p5.random(20, 50))
				this.nodes.push(new Node(p5, pos.x, pos.y, power, NodeType.Sink));
			}
			for (let i = 1; i <= 10; i++) {
				let pos = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
				let power = Math.round(p5.random(20, 50))
				this.nodes.push(new Node(p5, pos.x, pos.y, power, NodeType.Router));
			}
		};
		p5.draw = () => {
			
			// p5.clear()
			p5.background(127);
			p5.stroke(0)  
			p5.strokeWeight(0)
			p5.textSize(14)
			p5.text(String(Math.round(p5.frameRate())),2,12)
			this.calculateLinks(p5)
			this.nodes.forEach(node => node.draw());
		};
	};
	constructor() {
		new P5(this.sketch);
	}


	calculateLinks(p5: P5) {
		let spTree : Array<Node> = []
		let remTree : Array<Node> = this.nodes
		remTree.forEach(n => n.transmissionCost = (n.type == NodeType.Source) ? 0 : Number.MAX_SAFE_INTEGER)
		while(remTree.length > 0){
			let minNode = remTree.reduce((prev : Node, curr : Node) => {return prev.transmissionCost < curr.transmissionCost ? prev : curr})
			let minNodeIndex = remTree.findIndex( n=> n==minNode)
			remTree.splice(minNodeIndex,1)
			spTree.push(minNode)
			remTree.forEach( (rNode : Node) => {
				let minCost = rNode.transmissionCost
				let target : Node = undefined
				spTree.forEach( (sNode : Node) => {
					if(sNode.type == NodeType.Sink){
						return
					}
					let distance = sNode.transmissionCost + rNode.etx(sNode)
					if( distance <= minCost){
						minCost = distance
						target = sNode
					}
				})
				rNode.transmissionCost = minCost
				rNode.target = target
			})
		}
		this.nodes = spTree

	}

	onMouseClickCanvas(event, p5: P5) { }
	onMousePressedCanvas(event, p5: P5) {
		this.nodes.forEach(node => node.onClick(p5.mouseX, p5.mouseY))
		let nodesCheck = this.nodes.map((n) => n.posInsideNode(p5.mouseX, p5.mouseY))
		let clickedNode = nodesCheck.find(c => c != false)
		if (clickedNode) {
			this.mouseMoveFlag = true
			this.mouseMovePrevPos = p5.createVector(p5.mouseX, p5.mouseY)
			this.mouseMoveNode = clickedNode
		}
	}
	onMouseDClickCanvas(event, p5: P5) {
		let nodesCheck = this.nodes.map((n) => n.posInsideNode(p5.mouseX, p5.mouseY))
		let clickedNode = nodesCheck.find(c => c != false)
		if (!clickedNode) {
			let size = Math.round(p5.random(20, 50))
			this.nodes.push(new Node(p5, p5.mouseX, p5.mouseY, size, NodeType.Router));
		}
	}
	onMouseMoveCanvas(event, p5: P5) {
		if (this.mouseMoveFlag) {
			this.mouseMoveNode.x = p5.mouseX
			this.mouseMoveNode.y = p5.mouseY
			// p5.redraw()
		}
	}

	onMouseRelease(event, p5: P5) {
		this.mouseMoveFlag = false
	}

	onMouseWheelCanvas(event, p5: P5) {
		let nodesCheck = this.nodes.map((n) => n.posInsideNode(p5.mouseX, p5.mouseY))
		let clickedNode = nodesCheck.find(c => c != false)
		if(clickedNode){
			clickedNode.increasePower(event.deltaY)
		}
	}


}
new App();
