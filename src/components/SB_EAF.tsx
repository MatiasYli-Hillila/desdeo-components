import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useState, useRef } from "react";
import { ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray } from "../types/ProblemTypes";

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

    const renderW =
    solutionDimensionsState.width + solutionDimensionsState.margin.left + solutionDimensionsState.margin.right;
    const renderH =
    solutionDimensionsState.height + solutionDimensionsState.margin.bottom + solutionDimensionsState.margin.top;

    //console.log(solutionsState[0].objectiveValues[0]);
    //console.log(solutionsState[0].objectiveValues[1]);

    const legendCellsX0 = 30;
    const legendCellsY0 = 60;
    const legendCellsWidth = 20;
    const legendCellsHeight = 20;
    const cellOpacity = 1 / solutionCollection.scenarioIds.length;

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

        for (let i = 0; i < solutionCollection.scenarioIds.length; i++)
        {
            legendSVG
            .append('rect')
            .attr('width', legendCellsWidth)
            .attr('height', legendCellsHeight*(solutionCollection.scenarioIds.length-i))
            .attr('x', legendCellsX0)
            .attr('y', legendCellsY0 + i*legendCellsHeight)
            .style('fill', 'red')
            .style('opacity', cellOpacity);

            legendSVG
            .append('text')
            .attr('x', legendCellsX0 + 1.5*legendCellsWidth)
            .attr('y', legendCellsY0 + (i+0.5)*legendCellsHeight + 4)
            .style('text-anchor', 'left')
            .style('font-size', '12px')
            .text(i+1)
            .style('fill', 'black');
        }

        //#endregion

        for (let i = 0; i < solutionsState.length; i++)
        {
            /*
            legendSVG
            .append('text')
            .attr('x', 40)
            .attr('y', 223 + 16*i)
            .text(solutionCollection.solutions[i].solutionId);
            */

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
            const nadirsIterator = solutionCollection.objectiveNadirs.entries();
            const idealsIterator = solutionCollection.objectiveIdeals.entries();

            const xScale = scaleLinear()
            .range([0, solutionDimensionsState.width])
            .domain([nadirsIterator.next().value[1], idealsIterator.next().value[1]]);
            const xAxis = axisBottom(xScale);

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
            .domain([nadirsIterator.next().value[1], idealsIterator.next().value[1]]);
            const yAxis = axisLeft(yScale);

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

            /*
            const scenario1X = xScale(solutionsState[i].objectiveValues[0].objectiveValue);
            const scenario1Y = yScale(solutionsState[i].objectiveValues[1].objectiveValue);
            const scenario2X = xScale(solutionsState[i].objectiveValues[2].objectiveValue);
            const scenario2Y = yScale(solutionsState[i].objectiveValues[3].objectiveValue);
            */


            svg.selectAll()
            .append('g')
            .data(solutionsState[i].objectiveVectors)
            .enter()
            .append('circle')
            .attr('cx', datum => xScale(datum.objectiveValues[0]) + solutionDimensionsState.margin.left)
            .attr('cy', datum => yScale(datum.objectiveValues[1]) + solutionDimensionsState.margin.top)
            .attr('r', 3)
            .style('fill', (_,i) => {
                console.log((Math.floor((i+1)/solutionCollection.scenarioIds.length*0xAAAAAA)).toString(16));
                return `#${(Math.floor((i+1)/solutionCollection.scenarioIds.length*0xAAAAAA)).toString(16)}`;
            });
/*
            svg
            .append('rect')
            .attr('width', solutionDimensionsState.width-scenario1X)
            .attr('height', scenario1Y)
            .attr('x', scenario1X+solutionDimensionsState.margin.left)
            .attr('y', solutionDimensionsState.margin.bottom)
            .style('fill', 'red')
            .style('opacity', 0.5);

            svg
            .append("circle")
            .attr("cx", scenario1X+solutionDimensionsState.margin.left)
            .attr("cy", solutionDimensionsState.margin.bottom+scenario1Y)
            .attr("r", 3)
            .style("fill", "green")

            svg
            .append('text')
            .attr('x', scenario1X+solutionDimensionsState.margin.left+4)
            .attr('y', solutionDimensionsState.margin.bottom+scenario1Y-4)
            .style('text-anchor', 'left')
            .style('font-size', '12px')
            .text('s1')
            .style('fill', 'black')

            svg
            .append('rect')
            .attr('width', solutionDimensionsState.width-scenario2X)
            .attr('height', scenario2Y)
            .attr('x', scenario2X+solutionDimensionsState.margin.left)
            .attr('y', solutionDimensionsState.margin.bottom)
            .style('fill', 'red')
            .style('opacity', cellOpacity);

            svg
            .append("circle")
            .attr("cx", scenario2X+solutionDimensionsState.margin.left)
            .attr("cy", solutionDimensionsState.margin.bottom+scenario2Y)
            .attr("r", 3)
            .style("fill", "green")

            svg
            .append('text')
            .attr('x', scenario2X+solutionDimensionsState.margin.left+4)
            .attr('y', solutionDimensionsState.margin.bottom+scenario2Y-4)
            .style('text-anchor', 'left')
            .style('font-size', '12px')
            .text('s2')
            .style('fill', 'black')
            */
            };
    });

    return <div ref={ref} id="container" className="component-container"/>
};

export default SB_EAF;