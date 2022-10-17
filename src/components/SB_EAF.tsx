import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useState, useRef } from "react";
import { ScenarioBasedSolutionCollection } from "../types/ProblemTypes";

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
    solutionCollection: ScenarioBasedSolutionCollection;
    solutionDimensions?: solutionDimensions;
};

const SB_EAF = ({solutionCollection, solutionDimensions}: SB_EAFProps) => {
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

    const [solutionsState, setSolutionsState] = useState(solutionCollection.solutions);

    console.log(solutionsState[0].objectiveValues[0]);
    console.log(solutionsState[0].objectiveValues[1]);

    useEffect(() => {

        const renderW = solutionDimensionsState.width + solutionDimensionsState.margin.left + solutionDimensionsState.margin.right;
        const renderH = solutionDimensionsState.height + solutionDimensionsState.margin.bottom + solutionDimensionsState.margin.top;

        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();

        const legendSVG = svgContainer
        .append('svg')
        .classed('svg-content', true)
        .attr('width', 200)
        .attr('height', renderH);

        const asdf = 60;
        const qwerty = 30;

        legendSVG
        .append('text')
        .attr('x', 20)
        .attr('y', 25)
        .text('Number of scenarios');

        legendSVG
        .append('rect')
        .attr('width', 40)
        .attr('height', 80)
        .attr('x', qwerty)
        .attr('y', asdf)
        .style('fill', 'red')
        .style('opacity', 0.35);

        legendSVG
        .append('text')
        .attr('x', 50+qwerty)
        .attr('y', 25+asdf)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text('1')
        .style('fill', 'black');

        legendSVG
        .append('rect')
        .attr('width', 40)
        .attr('height', 40)
        .attr('x', qwerty)
        .attr('y', 40+asdf)
        .style('fill', 'red')
        .style('opacity', 0.35);

        legendSVG
        .append('text')
        .attr('x', 50+qwerty)
        .attr('y', 25+40+asdf)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text('2')
        .style('fill', 'black');

        legendSVG
        .append('text')
        .attr('x', 20)
        .attr('y', 200)
        .text('Solution');

        legendSVG
        .append("circle")
        .attr("cx", 30)
        .attr("cy", 220)
        .attr("r", 3)
        .style("fill", "green");

        legendSVG
        .append('text')
        .attr('x', 40)
        .attr('y', 223)
        .text(solutionCollection.solutions[0].solutionId);


        const svg = svgContainer
        .append('svg')
        .classed('svg-content', true)
        .attr('width', renderW)
        .attr('height', renderH);

        // the next().value property of these iterators returns key-value pairs from the respective maps
        // value[0] is the key, value[1] is the corresponding value
        const nadirsIterator = solutionCollection.objectiveNadirs.entries();
        const idealsIterator = solutionCollection.objectiveIdeals.entries();

        const xScale = scaleLinear()
        .range([0, solutionDimensionsState.width])
        .domain([nadirsIterator.next().value[1], idealsIterator.next().value[1]]);
        const xAxis = axisBottom(xScale);

        const yScale = scaleLinear()
        .range([solutionDimensionsState.height, 0])
        .domain([nadirsIterator.next().value[1], idealsIterator.next().value[1]]);
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
        //.text("Placeholder text f1 (min)");
        .text(
            `${solutionCollection.objectiveIds[0]} (
                ${solutionCollection.objectivesToMaximize.get(solutionCollection.objectiveIds[0]) ? 'max' : 'min'})`)

        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -solutionDimensionsState.width + solutionDimensionsState.margin.top)
        //.text("Placeholder text f2 (min)");
        .text(
            `${solutionCollection.objectiveIds[1]} (
                ${solutionCollection.objectivesToMaximize.get(solutionCollection.objectiveIds[1]) ? 'max' : 'min'})`)

        const solution1X = xScale(solutionsState[0].objectiveValues[0].objectiveValue);
        const solution1Y = yScale(solutionsState[0].objectiveValues[1].objectiveValue);
        const solution2X = xScale(solutionsState[0].objectiveValues[2].objectiveValue);
        const solution2Y = yScale(solutionsState[0].objectiveValues[3].objectiveValue);

        console.log(xScale(0.8));

        svg
        .append('rect')
        .attr('width', solutionDimensionsState.width-solution1X)
        .attr('height', solution1Y)
        .attr('x', solution1X+solutionDimensionsState.margin.left)
        .attr('y', solutionDimensionsState.margin.bottom)
        .style('fill', 'red')
        .style('opacity', 0.35);

        svg
        .append("circle")
        .attr("cx", solution1X+solutionDimensionsState.margin.left)
        .attr("cy", solutionDimensionsState.margin.bottom+solution1Y)
        .attr("r", 3)
        .style("fill", "green")

        svg
        .append('text')
        .attr('x', solution1X+solutionDimensionsState.margin.left+4)
        .attr('y', solutionDimensionsState.margin.bottom+solution1Y-4)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text('s1')
        .style('fill', 'black')

        svg
        .append('rect')
        .attr('width', solutionDimensionsState.width-solution2X)
        .attr('height', solution2Y)
        .attr('x', solution2X+solutionDimensionsState.margin.left)
        .attr('y', solutionDimensionsState.margin.bottom)
        .style('fill', 'red')
        .style('opacity', 0.35);

        svg
        .append("circle")
        .attr("cx", solution2X+solutionDimensionsState.margin.left)
        .attr("cy", solutionDimensionsState.margin.bottom+solution2Y)
        .attr("r", 3)
        .style("fill", "green")

        svg
        .append('text')
        .attr('x', solution2X+solutionDimensionsState.margin.left+4)
        .attr('y', solutionDimensionsState.margin.bottom+solution2Y-4)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text('s2')
        .style('fill', 'black')


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