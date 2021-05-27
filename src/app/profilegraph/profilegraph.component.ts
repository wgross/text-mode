import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { min } from 'd3';
import { ProfileNode, ProfileLink } from "../profile-node";

@Component({
  selector: 'app-profilegraph',
  templateUrl: './profilegraph.component.html',
  styleUrls: ['./profilegraph.component.css']
})
export class ProfilegraphComponent implements OnInit {

  nodesSelection?: any;
  linksSelection?: any;
  textsSelection?: any;
  simulation?: d3.Simulation<d3.SimulationNodeDatum, undefined>;

  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.readData();
    this.drawGraph();
    this.createForceSimulation();
    this.attachZoomAndPanning();
  }


  private nodesData: ProfileNode[] = [];
  private linksData: ProfileLink[] = [];
  private graphSelection?: any;
  private listenerRect? :any;

  async readData(): Promise<void> {
    await d3.json("assets/qualification.json").then((data: any) => {

      this.nodesData = [];
      this.linksData = [];

      const n = <ProfileNode>(data.nodes[0]);

      data.nodes.forEach((d: any) => this.nodesData.push(<ProfileNode>d));
      data.links.forEach((d: any) => this.linksData.push(<ProfileLink>d));
    });
  }

  drawGraph(): void {
    // select the SVG with id graph to draw in
    //this.graphSelection = d3.select("rect#listenerRect");
    this.drawGraphContainer();
    // add all edges before nodes. Nodes will hav higher z-order and
    // will hde the edged behind them
    this.drawEdges();
    this.drawNodes();
  }

  drawGraphContainer(): void {
    this.graphSelection = this.graphSelection = d3.select("#graphContainer")
      .append('svg').attr('width', 700).attr('height', 600)
      .append('g').attr('class', 'graph')
      .attr('transform', 'translate(300, 300)');


    this.listenerRect = this.graphSelection.append('rect')
      .attr('class', 'listener-rect')
      .attr('x', -300).attr('y', -300)
      .attr('width', 600)
      .attr('height',700)
      .style('opacity', 0);
  }

  drawNodes(): void {
    // create color scale of 10 colors
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // draw the circles representing nodes
    this.nodesSelection = this.graphSelection
      .append('g').attr('class', 'nodes')
      .selectAll('circle').data(this.nodesData)
      .enter()
      // radius is a dynamic data depending on property 'wight' of the nodes bound data
      .append('circle').attr('r', (n: any) => n.weight).attr('fill', (n: any) => color(n.group.toString()))
      .call(d3.drag()
        .on('start', (ev, d) => this.dragStarted(ev, d))
        .on('drag', (ev, d) => this.dragged(ev, d))
        .on('end', (ev, d) => this.dragEnded(ev, d)));

    // add a popup with the id
    this.nodesSelection.append('title').text((n: any) => n.id);

    // draw the id as text right next to the nodes shape
    this.textsSelection = this.graphSelection.append('g')
      .selectAll('text').data(this.nodesData)
      .enter()
      .append('text')
      .text((n: any) => n.id).attr('font-size', 14).attr('dx', 15).attr('dy', 4).attr('fill', 'lightgray');
  }

  drawEdges(): void {
    this.linksSelection = this.graphSelection
      .append('g').attr('class', 'links')
      .selectAll('line').data(this.linksData)
      .enter()
      .append('line')
      .attr('stroke', 'gray')
      // the width is a dynamic property depending on the property 'value' of the links bound data
      .attr('stroke-width', (l: any) => Math.sqrt(l.value))
      .attr('color', 'white');
  }

  attachZoomAndPanning() {
    const zoom = d3.zoom()
      .scaleExtent([0.5, 1.5])
      .on('zoom', (ev: any) => this.zoomed(ev));

    this.listenerRect.call(zoom);
  }

  createForceSimulation(): void {
    const w = this.graphSelection.attr('width');
    const h = this.graphSelection.attr('height');
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().strength(0.05).id((l: any) => l.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(w / 2, h / 2));

    this.simulation.nodes(this.nodesData).on('tick', () => this.ticked());

    this.simulation.force<d3.ForceLink<ProfileNode, ProfileLink>>('link')?.links(this.linksData);
  }

  // event handlers for d3

  dragged(event: any, item: any): any {
    const w = this.listenerRect.attr('width');
    const h = this.listenerRect.attr('height');
    item.fx = event.x;
    item.fy = event.y;
  }

  dragStarted(event: any, item: any): any {
    if (!event.active) this.simulation!.alphaTarget(0.3).restart();
    item.fx = item.x;
    item.fy = item.y;
  }

  dragEnded(event: any, item: any) {
    if (!event.active) this.simulation!.alphaTarget(0);
    item.fx = null;
    item.fy = null;
  }

  ticked(): void {
    this.linksSelection
      .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);

    this.nodesSelection.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

    this.textsSelection.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
  }

  private tx: number = 0;
  private ty: number = 0;
  private scale: number = 1;

  zoomed(event: any): void {

    var transform = event.transform;

    this.nodesSelection.attr('transform', transform.toString());
    this.linksSelection.attr('transform', transform.toString());
    this.textsSelection.attr('transform', transform.toString());
  }
}
