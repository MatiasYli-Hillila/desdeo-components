import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { ScenarioBasedSolutionCollection } from "../types/ProblemTypes"
import "d3-transition";
import "./Svg.css";

interface HeatMapProps {
    solutions : ScenarioBasedSolutionCollection;
    width?: number;
    height?: number;
}

const HeatMap = ({solutions} : HeatMapProps) => {
    const ref = useRef(null);
    const defaultDimensions = {
        width: 300,
        height: 300,
        margin: {top: 20, right: 20, bottom: 20, left: 20}
    }       

    useEffect(() => {
        const svgContainer = select(ref.current)
            //.classed('component-container', true);

        //svgContainer.selectAll('*').remove();
        
        const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('width', defaultDimensions.width + defaultDimensions.margin.left + defaultDimensions.margin.right)
            .attr('height', defaultDimensions.height + defaultDimensions.margin.top + defaultDimensions.margin.bottom)
            .attr("transform", `translate(${defaultDimensions.margin.left},${defaultDimensions.margin.top})`);

        const tooltip = svgContainer
            .append('div')
            .classed('tooltip', true);

        const xScale = scaleBand()
            .range([0, defaultDimensions.width])
            .domain(solutions.scenarioIds)
            .padding(0.01);
        const xAxis = axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(0,${defaultDimensions.height})`)
            .call(xAxis);

        const yScale = scaleBand()
            .range([defaultDimensions.height, 0])
            .domain(solutions.objectiveIds)
            .padding(0.01);
        const yAxis = axisLeft(yScale);
        svg.append("g")
            .call(yAxis);

        if (svg === undefined) console.log('svg undefined');
        else{

        
        svg.selectAll()
            .data(solutions.solutions[0], d => d)
            .enter()
            .append('rect')
            .attr('x', datum => xScale(datum.scenarioId))
            .attr('y', datum => yScale(datum.objectiveId))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => interpolateBlues(datum.objectiveValue))
            /**/
        }
    });

    return <div ref={ref} id="container" className="component-container"/>
    //return <svg ref={ref} width={svgWidth} height={svgHeight} />;
}; 

export default HeatMap;