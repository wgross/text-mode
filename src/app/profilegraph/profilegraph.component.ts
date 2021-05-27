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

  nodesDrawn?: any;
  linksDrawn?: any;
  textsDrawn?: any;
  simulation?: d3.Simulation<d3.SimulationNodeDatum, undefined>;

  constructor() { }

  async ngOnInit(): Promise<void> {
    await this.readData();
    this.drawGraph();
    this.createForceSimulation();
  }

  private nodesData: ProfileNode[] = [];
  private linksData: ProfileLink[] = [];
  private svg?: any;

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
    // width and viewport are defined in html
    this.svg = d3.select("svg#graph");
    this.drawEdges();
    this.drawNodes();
  }

  drawNodes(): void {
    // create color scale of 10 colors
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // draw the circles representing nodes
    this.nodesDrawn = this.svg
      .append('g').attr('class', 'nodes')
      .selectAll('circle').data(this.nodesData)
      .enter()
      .append('circle').attr('r', (n:any) => n.weight).attr('fill', (n: any) => color(n.group.toString()))
      .call(d3.drag()
        .on('start', (ev, d) => this.dragStarted(ev, d))
        .on('drag', (ev, d) => this.dragged(ev, d))
        .on('end', (ev, d) => this.dragEnded(ev, d)));

    this.nodesDrawn.append('title').text((n: any) => n.id);

    this.textsDrawn = this.svg.append('g')
      .selectAll('text').data(this.nodesData)
      .enter()
      .append('text')
      .text((n: any) => n.id).attr('font-size', 14).attr('dx', 10).attr('dy', 4).attr('fill','lightgray');
  }


  drawEdges(): void {
    this.linksDrawn = this.svg
      .append('g').attr('class', 'links')
      .selectAll('line').data(this.linksData)
      .enter()
      .append('line')
      .attr('stroke', 'gray')
      .attr('stroke-width', (l: any) => Math.sqrt(l.value))
      .attr('color', 'white');
  }

  createForceSimulation(): void {
    const w = this.svg.attr('width');
    const h = this.svg.attr('height');
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().strength(0.05).id((l: any) => l.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(w / 2, h / 2));

    this.simulation.nodes(this.nodesData).on('tick', () => this.ticked(
      this.nodesDrawn,
      this.linksDrawn,
      this.textsDrawn));

    this.simulation.force<d3.ForceLink<ProfileNode, ProfileLink>>('link')?.links(this.linksData);
  }

  // event handlers for d3

  dragged(event: any, item: any): any {
    item.fx = Math.max(0,Math.min(700,event.x));
    item.fy = Math.max(0,Math.min(600,event.y));
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

  ticked(nodes: any, links: any, texts: any): void {
    links
      .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);

    nodes.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

    texts.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
  }
}
