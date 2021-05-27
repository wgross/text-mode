
import { SimulationLinkDatum } from "d3";
import { SimulationNodeDatum } from "d3"

export interface ProfileNode extends SimulationNodeDatum {
  id: string;
  group: number;
  weight: number;
}

export interface ProfileLink extends SimulationLinkDatum<ProfileNode> {
  source: string;
  target: string;
  value: number;
}
