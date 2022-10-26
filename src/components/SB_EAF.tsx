import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
//import { defaultMaxListeners } from "events";
import { useEffect, useState, useRef } from "react";
import { calculateCollisionsForSolution } from "../helper-functions/rectFunctions";
import { ScenarioBasedObjectiveVector, ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray } from "../types/ProblemTypes";

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
    solutionCollection: ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray;
    solutionDimensions?: solutionDimensions;
    showScenarioNames?: boolean;
    scenarioCountColors?: string[];
};

const SB_EAF = (
    {
        solutionCollection,
        solutionDimensions,
        showScenarioNames,
        scenarioCountColors
    }: SB_EAFProps) => {

    const ref = useRef(null);

    // TODO: Document default values somehow
    //#region Constants and states

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
    const defaultScenarioCountColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    const legendCellsX0 = 30;
    const legendCellsY0 = 60;
    const legendCellsWidth = 20;
    const legendCellsHeight = 20;
    const axisMinMultiplier = 0.9;
    const axisMaxMultiplier = 1.1;

    const [
        solutionDimensionsState,
        //setSolutionDimensionsState
    ] = useState(solutionDimensions ? solutionDimensions : solutionDefaultDimensions);

    const [
        solutionsState,
        //setSolutionsState
    ] = useState(solutionCollection.solutions);
    const [
        showScenarioNamesState,
        //setShowScenarioNamesState
    ] = useState((showScenarioNames !== undefined) ? showScenarioNames : true);
    const [
        scenarioCountColorsState,
        //setScenarioCountColorsState
    ] = useState(scenarioCountColors ? scenarioCountColors : defaultScenarioCountColors);

    const renderW = solutionDimensionsState.width +
        solutionDimensionsState.margin.left +
        solutionDimensionsState.margin.right;
    const renderH = solutionDimensionsState.height +
        solutionDimensionsState.margin.bottom +
        solutionDimensionsState.margin.top;

    //#endregion

    useEffect(() => {

        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();

        //#region legend

        const legendSVG = svgContainer
        .append('svg')
        .classed('svg-content', true)
        .attr('width', 200)
        .attr('height', renderH);

        legendSVG
        .append('text')
        .attr('x', 20)
        .attr('y', 25)
        .text('Number of scenarios');

        legendSVG
        .selectAll()
        .data(solutionCollection.scenarioIds)
        .enter()
        .append('rect')
        .attr('width', legendCellsWidth)
        .attr('height', legendCellsHeight)
        .attr('x', legendCellsX0)
        .attr('y', (_,i) => legendCellsY0 + i*legendCellsHeight)
        .style('fill', (_,i) => scenarioCountColorsState[i])

        if (showScenarioNamesState)
        {
            legendSVG
            .selectAll()
            .data(solutionCollection.scenarioIds)
            .enter()
            .append('text')
            .attr('x', legendCellsX0 + 1.5*legendCellsWidth)
            .attr('y', (_,i) => legendCellsY0 + (i+0.5)*legendCellsHeight + 4)
            .style('text-anchor', 'left')
            .style('font-size', '12px')
            .text((_,i) => i+1)
            .style('fill', 'black');
        }

        /*
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
        */

        //#endregion

        //#region tooltip
        const tooltip = svgContainer
        .append('g')
        .classed('tooltip', true)
        .style('pointer-events', 'none')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('position', 'absolute')
        .style('z-index', 1000)
        .text('placeholder');

        const tooltipMouseover = (_: MouseEvent, datum: [number, number, number]) => {
            // TODO: Think of a better way to express "intersection in the tooltip"
            tooltip.html(`Number of scenarios: ${datum[2]+1}</br></br> intersection: (${datum[0]},${datum[1]})`);

            tooltip.style('visibility', 'visible');
        }
        const tooltipMouseleave = () => tooltip.style('visibility', 'hidden');

        const tooltipMousemove = (event: MouseEvent) => {
            const [x,y] = [event.pageX, event.pageY];
            tooltip
            .style('left', `${x+20}px`)
            .style('top', `${y-10}px`);
        };

        //#endregion
        for (let i = 0; i < solutionsState.length; i++)
        {
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('width', renderW)
            .attr('height', renderH);

            svg.append('text')
            .attr("x", (solutionDimensionsState.width / 2 + solutionDimensionsState.margin.left))
            .attr("y", (solutionDimensionsState.margin.top / 2))
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .text(() => solutionsState[i].solutionId.toString())
            .style('fill', 'black');

            // the next().value property of these iterators returns key-value pairs from the respective maps
            // value[0] is the key, value[1] is the corresponding value
            const maxIterator = solutionCollection.objectivesToMaximize.entries();
            const nadirsIterator = solutionCollection.objectiveNadirs.entries();
            const idealsIterator = solutionCollection.objectiveIdeals.entries();

            const xScale = scaleLinear()
            .range([0, solutionDimensionsState.width])
            .domain(
                maxIterator.next().value[1]
                ? [nadirsIterator.next().value[1]*axisMinMultiplier, idealsIterator.next().value[1]*axisMaxMultiplier]
                : [idealsIterator.next().value[1]*axisMinMultiplier, nadirsIterator.next().value[1]*axisMaxMultiplier]
            );
            const xAxis = axisBottom(xScale).ticks(6);

            svg
            .append('g')
            .attr(
                "transform",
                `translate(
                    ${solutionDimensionsState.margin.left},
                    ${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
            .call(xAxis);

            const yScale = scaleLinear()
            .range([solutionDimensionsState.height, 0])
            .domain(
                maxIterator.next().value[1]
                ? [nadirsIterator.next().value[1]*axisMinMultiplier, idealsIterator.next().value[1]*axisMaxMultiplier]
                : [idealsIterator.next().value[1]*axisMinMultiplier, nadirsIterator.next().value[1]*axisMaxMultiplier]
            );
            const yAxis = axisLeft(yScale).ticks(6);

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
            // TODO: Line over 120
            .text(
                `${solutionCollection.objectiveIds[0]} (${solutionCollection.objectivesToMaximize.get(solutionCollection.objectiveIds[0]) ? 'max' : 'min'})`
            );

            svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", 40)
            .attr("x", -solutionDimensionsState.width + solutionDimensionsState.margin.top)
            // TODO: Line over 120
            .text(`${solutionCollection.objectiveIds[1]} (${solutionCollection.objectivesToMaximize.get(solutionCollection.objectiveIds[1]) ? 'max' : 'min'})`
            );

            const rectInfo = calculateCollisionsForSolution(solutionsState[i]);

            svg.selectAll()
            .append('g')
            .data(rectInfo)
            .enter()
            .append('rect')
            .attr('x', datum => solutionDimensionsState.margin.left + xScale(datum[0]))
            .attr('y', solutionDefaultDimensions.margin.top)
            .attr('width', datum => solutionDimensionsState.width - xScale(datum[0]))
            .attr('height', datum => yScale(datum[1]))
            .style('fill', datum => scenarioCountColorsState[datum[2]])
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', tooltipMouseover);

            svg.selectAll()
            .append('g')
            .data(solutionsState[i].objectiveVectors)
            .enter()
            .append('circle')
            .attr('cx', datum => xScale(datum.objectiveValues[0]) + solutionDimensionsState.margin.left)
            .attr('cy', datum => yScale(datum.objectiveValues[1]) + solutionDimensionsState.margin.top)
            .attr('r', 3)
            .style('fill', (_,i) => {
                return `#${(Math.floor((i+1)/solutionCollection.scenarioIds.length*0xAAAAAA)).toString(16)}`;
            });

            svg.selectAll()
            .data(solutionsState[i].objectiveVectors)
            .enter()
            .append('text')
            .text(datum => datum.scenarioId)
            .attr('x', datum => xScale(datum.objectiveValues[0]) + solutionDimensionsState.margin.left + 4)
            .attr('y', datum => yScale(datum.objectiveValues[1]) + solutionDimensionsState.margin.top - 4)
            .style('pointer-events', 'none');

            };
    });

    return <div ref={ref} id="container" className="component-container"/>
};

export default SB_EAF;