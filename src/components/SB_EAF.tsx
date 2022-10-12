import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useState, useRef } from "react";

import "./Svg.css";

interface solutionDimensions {
    width: number,
    height: number,
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    }
};

interface SB_EAFProps {
    solutionDimensions?: solutionDimensions;
};

const SB_EAF = ({solutionDimensions}: SB_EAFProps) => {
    const ref = useRef(null);
    const solutionDefaultDimensions: solutionDimensions = {
        width: 300,
        height: 300,
        margin: {
            top: 80,
            right: 20,
            bottom: 80,
            left: 80
        }
    };

    const [
        solutionDimensionsState,
        setSolutionDimensionsState
    ] = useState(solutionDimensions ? solutionDimensions : solutionDefaultDimensions);

    useEffect(() => {

        const renderW = solutionDimensionsState.width + solutionDimensionsState.margin.left + solutionDimensionsState.margin.right;
        const renderH = solutionDimensionsState.height + solutionDimensionsState.margin.bottom + solutionDimensionsState.margin.top;

        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();

        const svg = svgContainer
        .append('svg')
        .classed('svg-content', true)
        .attr('width', renderW)
        .attr('height', renderH);

        const xScale = scaleLinear()
        .range([0, solutionDimensionsState.width])
        .domain([0, 100]);
        const xAxis = axisBottom(xScale);

        const yScale = scaleLinear()
        .range([solutionDimensionsState.height, 0])
        .domain([0, 100]);
        const yAxis = axisLeft(yScale);

        svg
        .append('g')
        .attr(
            "transform",
            `translate(
                ${solutionDimensionsState.margin.left},
                ${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
        .call(xAxis);

        svg
        .append('g')
        .attr(
            'transform',
            `translate(
                ${solutionDimensionsState.margin.left},
                ${solutionDimensionsState.margin.top})`)
        .call(yAxis);

        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", renderW/2)
        .attr("y", solutionDimensionsState.height + solutionDimensionsState.margin.top + 40)
        .text("Placeholder text f1 (min)");

        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -solutionDimensionsState.width + solutionDimensionsState.margin.top)
        .text("Placeholder text f2 (min)");

        /*
        //#region placeholder visualization
        svg
        .append('rect')
        .attr('width', 300)
        .attr('height', 200)
        .attr('x', 0)
        .attr('y', 200)
        .style('fill', 'red')
        .style('opacity', 0.35);

        svg
        .append("circle")
        .attr("cx", 2 )
        .attr("cy", 398 )
        .attr("r", 3)
        .style("fill", "green")

        svg
        .append('text')
        .attr('x', 4)
        .attr('y', 390)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text(() => 'Scenario 1')
        .style('fill', 'black')

        svg
        .append('rect')
        .attr('width', 200)
        .attr('height', 150)
        .attr('x', 100)
        .attr('y', 200)
        .style('fill', 'red')
        .style('opacity', 0.35);

        svg
        .append("circle")
        .attr("cx", 102 )
        .attr("cy", 350 )
        .attr("r", 3)
        .style("fill", "green");

        svg
        .append('text')
        .attr('x', 104)
        .attr('y', 342)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text(() => 'Scenario 2')
        .style('fill', 'black');

        svg
        .append('rect')
        .attr('width', 220)
        .attr('height', 120)
        .attr('x', 80)
        .attr('y', 200)
        .style('fill', 'red')
        .style('opacity', 0.35);

        svg
        .append("circle")
        .attr("cx", 82 )
        .attr("cy", 320 )
        .attr("r", 3)
        .style("fill", "green");

        svg
        .append('text')
        .attr('x', 84)
        .attr('y', 312)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text(() => 'Scenario 3')
        .style('fill', 'black');

        //#endregion
        */
    });

    return <div ref={ref} id="container" className="component-container"/>
};

export default SB_EAF;