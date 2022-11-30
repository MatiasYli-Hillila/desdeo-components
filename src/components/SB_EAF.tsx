import { useEffect, useState, useRef } from "react";

import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateRainbow, interpolateViridis } from "d3-scale-chromatic";

import { calculateCollisionsForSolution } from "../helper-functions/rectFunctions";
import {
    ScenarioBasedObjectiveVector,
    ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray,
    ScenarioBasedSolutionUsingObjectiveVectors,
    MinOrMax
} from "../types/ProblemTypes";

import "./Svg.css";
import { line, symbol, symbols, symbolStar } from "d3-shape";

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

// TODO: Should this interface be removed and the typings moved to SB_EAF function itself?
interface SB_EAFProps {
    solutionCollection: ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray;
    solutionDimensions?: solutionDimensions;
    showScenarioNames: boolean;
    scenarioCountColorFunction?: (t: number) => string;
    stackSolutionsToOneGraph: boolean;
    minOrMaxArray?: MinOrMax[];
};

/**
 * 2D Visualization of Scenario-Based Empirical Attainment Function.
 * @param scenarioCountColorFunction A function that takes in a number in the range [0,1] and returns a color string.
 */
const SB_EAF = (
    {
        solutionCollection,
        solutionDimensions,
        showScenarioNames,
        scenarioCountColorFunction,
        stackSolutionsToOneGraph = true,
        minOrMaxArray
    }: SB_EAFProps) => {

    const ref = useRef(null);

    // TODO: Document default values somehow
    //#region Constants and states

    const solutionDefaultDimensions: solutionDimensions = {
        width: 500,
        height: 500,
        margin: {
            top: 80,
            right: 20,
            bottom: 80,
            left: 80
        }
    };

    const solutionDefaultMinOrMaxArray = [1,1];

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

    const [solutionsState, setSolutionsState] = useState(solutionCollection.solutions);
    const [
        removedSolutionsState,
        setRemovedSolutionsState
    ] = useState(Array<ScenarioBasedSolutionUsingObjectiveVectors>());
    const [
        showScenarioNamesState,
        setShowScenarioNamesState
    ] = useState((showScenarioNames !== undefined) ? showScenarioNames : true);
    const [
        stackSolutionsToOneGraphState,
        //setStackSolutionsToOneGraphState
    ] = useState(stackSolutionsToOneGraph);

    const renderW = solutionDimensionsState.width +
        solutionDimensionsState.margin.left +
        solutionDimensionsState.margin.right;
    const renderH = solutionDimensionsState.height +
        solutionDimensionsState.margin.bottom +
        solutionDimensionsState.margin.top;

    /* See https://stackoverflow.com/a/55621679 for why () => scenarioCountColorFunction, instead of just
    scenarioCountColorFunction */
    const [
        scenarioCountColorsState,
        //setScenarioCountColorsState
    ] = useState(scenarioCountColorFunction
        ? () => (colorNumber: number) => scenarioCountColorFunction(colorNumber / (solutionCollection.scenarioIds.length-1))
        : () => (colorNumber: number) => interpolateViridis(colorNumber / (solutionCollection.scenarioIds.length-1)));

    //#endregion

    useEffect(() => setShowScenarioNamesState(showScenarioNames), [showScenarioNames]);

    /* Render the component */
    useEffect(() => {

        const componentContainer = select(ref.current).classed('component-container', true);
        //const svgContainer = select(ref.current);
        componentContainer.selectAll('*').remove();

        const svgContainer = componentContainer.append('svg');//.classed('div-inline', true);



        //#region legend

        const legendContainer = componentContainer
        .append('svg')
        .classed('legend', true)
        .attr('width', 200)
        .attr('height', renderH);

        //.append('div').classed('div-inline', true).attr('width', 500);

        const legendSVG = legendContainer
        .append('svg')
        .classed('legend', true)
        .attr('width', 200)
        .attr('height', renderH);
        //.style('margin-left', 200);

        legendContainer
        .append('text')
        .attr('x', 20)
        .attr('y', 25)
        .text('Number of scenarios');

        legendContainer
        .selectAll()
        .data(solutionCollection.scenarioIds)
        .enter()
        .append('rect')
        .attr('id', (_,i) => `legend-rect-${i+1}`)
        .attr('width', legendCellsWidth)
        .attr('height', legendCellsHeight)
        .attr('x', legendCellsX0)
        .attr('y', (_,i) => legendCellsY0 + i*legendCellsHeight)
        .style('fill', (_,i) => scenarioCountColorsState(i));

        legendContainer
        .selectAll()
        .data(solutionCollection.scenarioIds)
        .enter()
        .append('text')
        .attr('id', (_,i) => `legend-text-${i+1}`)
        .attr('x', legendCellsX0 + 1.5*legendCellsWidth)
        .attr('y', (_,i) => legendCellsY0 + (i+0.5)*legendCellsHeight + 4)
        .style('text-anchor', 'left')
        .style('font-size', '12px')
        .text((_,i) => i+1)
        .style('fill', 'black');

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
        .style('z-index', 1000);
        //.text('placeholder');

        const tooltipMouseover = (_: MouseEvent, datum: [number, number, number]) => {
            // TODO: Think of a better way to express "intersection in the tooltip"
            tooltip.html(`Number of scenarios: ${datum[2]+1}</br></br> intersection: (${datum[0]},${datum[1]})`);

            tooltip.style('visibility', 'visible');

            legendContainer
            .select(`#legend-rect-${datum[2]+1}`)
            .style('stroke-width', 2)
            .style('stroke', 'rgb(0,0,0');

            const legendFontSize = Number(
                legendContainer
                .select(`#legend-text-${datum[2]+1}`)
                .style('font-size')
                .slice(0,-2)
            );

            legendContainer
                .select(`#legend-text-${datum[2]+1}`)
                .style('font-size', `${legendFontSize+4}px`);
        };

        const tooltipMouseleave = (_: MouseEvent, datum: [number, number, number]) => {
            tooltip.style('visibility', 'hidden');

            legendContainer
            .selectAll('rect')
            .style('stroke-width', 0);

            const legendFontSize = Number(
                legendContainer
                .select(`#legend-text-${datum[2]+1}`)
                .style('font-size')
                .slice(0,-2)
            );

            legendContainer
                .select(`#legend-text-${datum[2]+1}`)
                .style('font-size', `${legendFontSize-4}px`);
        };

        const tooltipMousemove = (event: MouseEvent) => {
            const [x,y] = [event.pageX, event.pageY];
            tooltip
            .style('left', `${x+20}px`)
            .style('top', `${y-10}px`);

            /*
            svgContainer
            .append('line')
            .style('stroke', 'red')
            .attr('x1', 0)
            .attr('x2', 100)
            .attr('y1', 0)
            .attr('y2', 100)
            */
        };

        //#endregion

        //#region removed solutions list

        const removeSolution = (event: MouseEvent) => {
            const eventTarget = event.target as HTMLElement;
                const solutionId = eventTarget.parentElement?.id;
                //console.log(`solutionId: ${solutionId}`);
                if (solutionsState.length > 1) {
                    const solutionToRemoveIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                    const solutionToRemove = solutionsState[solutionToRemoveIndex];
                    setSolutionsState([
                        ...solutionsState.slice(0, solutionToRemoveIndex),
                        ...solutionsState.slice(solutionToRemoveIndex + 1, solutionsState.length)
                    ]);
                    setRemovedSolutionsState(state => [...state, solutionToRemove]);
                }
        };

        const addSolutionBack = (event: MouseEvent) => {
            const eventTarget = event.target as HTMLElement;
            const solutionToAddBackIndex = removedSolutionsState.findIndex(i => i.solutionId === eventTarget.textContent);
            const solutionToAddBack = removedSolutionsState[solutionToAddBackIndex];
            if (solutionToAddBack !== null && solutionToAddBack !== undefined)
            {
                setSolutionsState(state => [...state, solutionToAddBack]);
                setRemovedSolutionsState([
                    ...removedSolutionsState.slice(0, solutionToAddBackIndex),
                    ...removedSolutionsState.slice(solutionToAddBackIndex + 1, removedSolutionsState.length)
                ]);
            }
        };

        // TODO: Solution removal looks ugly and doesn't scroll
        const removedSolutionsListSVG = svgContainer
        //.style('overflow', 'scroll')
        .append('svg')
        .classed('svg-content', true)
        //.attr('viewBox', '0,0,150,200')
        .attr('width', 200)
        .attr('height', renderH)

        removedSolutionsListSVG
        .append('text')
        .attr('x', 20)
        .attr('y', 25)
        //.style('text-anchor', 'middle')
        //.style('font-size', '16px')
        .text('Hidden solutions');
        //.style('fill', 'black')
        removedSolutionsListSVG
        //.attr('viewBox', "0,0,200, 400")
        .selectAll()
        //.attr('width', 100)
        //.attr('height', 400)
        //.attr('x', 0)
        .data(removedSolutionsState)
        .enter()
        .append('text')
        .text(d => d.solutionId)
        .attr('x', 10)
        .attr('y', (_,i) => 50+i*30)
        .on('click', mouseEvent => addSolutionBack(mouseEvent));

        //#endregion

        // TODO: Refactor this so not so much code is copypasted
        if (!stackSolutionsToOneGraphState)
        {
            for (let i = 0; i < solutionsState.length; i++)
            {
                const svg = componentContainer
                .append('svg')
                .classed('solution', true)
                .attr('id', solutionsState[i].solutionId)
                .attr('width', renderW)
                .attr('height', renderH);

                //console.log('SB_EAF: debugging');
                //console.log(solutionsState);

                svg.append('text')
                .attr("x", (solutionDimensionsState.width / 2 + solutionDimensionsState.margin.left))
                .attr("y", (solutionDimensionsState.margin.top / 2))
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text(() => solutionsState[i].solutionId.toString())
                .style('fill', 'black')
                .on('click', removeSolutionEvent => removeSolution(removeSolutionEvent));

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
                    'transform',
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
                .style('fill', datum => scenarioCountColorsState(datum[2]))
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

                if (showScenarioNamesState)
                {
                    svg.selectAll()
                    .data(solutionsState[i].objectiveVectors)
                    .enter()
                    .append('text')
                    .text(datum => datum.scenarioId)
                    .attr('x', datum => xScale(datum.objectiveValues[0]) + solutionDimensionsState.margin.left + 4)
                    .attr('y', datum => yScale(datum.objectiveValues[1]) + solutionDimensionsState.margin.top - 4)
                    .style('pointer-events', 'none');
                };
            };
        }
        else
        {
            const svg = componentContainer
            .append('svg')
            .classed('solution', true)
            .attr('id', 'solutions')
            .attr('width', renderW)
            .attr('height', renderH);

            svg.append('text')
            .attr("x", (solutionDimensionsState.width / 2 + solutionDimensionsState.margin.left))
            .attr("y", (solutionDimensionsState.margin.top / 2))
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .text('Scenarios for all solutions')
            .style('fill', 'black')
            .on('click', removeSolutionEvent => removeSolution(removeSolutionEvent));

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

            let rectInfo: Array<[number, number, number]> = [];

            for (let i = 0; i < solutionsState.length; i++)
            {
                rectInfo = rectInfo.concat(calculateCollisionsForSolution(solutionsState[i]));
            };

            rectInfo.sort((a,b) => a[2]-b[2]);

            svg.selectAll()
            .append('g')
            .data(rectInfo)
            .enter()
            .append('rect')
            .attr('x', datum => solutionDimensionsState.margin.left + xScale(datum[0]))
            .attr('y', solutionDefaultDimensions.margin.top)
            .attr('width', datum => solutionDimensionsState.width - xScale(datum[0]))
            .attr('height', datum => yScale(datum[1]))
            .style('fill', datum => scenarioCountColorsState(datum[2]))
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', tooltipMouseover);

            for (let i = 0; i < solutionsState.length; i++)
            {
                const currentSymbolType = symbols[i % 7];
                const currentSymbol = symbol().type(currentSymbolType).size(24);
                const marginedX = (d: [number, number]) => solutionDimensionsState.margin.left + xScale(d[0]);
                const marginedY = (d: [number, number]) => solutionDimensionsState.margin.left + yScale(d[1]);
                const lineGenerator = line()
                    .x(d => marginedX(d))
                    .y(d => marginedY(d));
                const solutionPoints: Array<[number, number]> = Array<[number, number]>();
                const currentSolution = solutionsState[i];
                for (let j = 0; j < solutionsState[i].objectiveVectors.length; j++)
                {
                    const asdf5 = currentSolution.objectiveVectors[j].objectiveValues;
                    solutionPoints.push([asdf5[0], asdf5[1]]);
                };

                const lineGroup = svg
                .selectAll()
                .data([solutionPoints])
                .enter()
                .append('g')
                .attr('class', 'line');

                lineGroup
                .append('path')
                .attr('d', datum => lineGenerator(datum))
                .attr('stroke', interpolateRainbow((i+1)/(solutionCollection.scenarioIds.length+1)/2))
                .attr('fill', 'none');

                lineGroup
                .selectAll('symbol')
                .data(d => d)
                .enter()
                .append('path')
                .attr('transform', datum => `translate(${marginedX(datum)},${marginedY(datum)})`)
                .attr('d', currentSymbol)
                .attr('fill', interpolateRainbow((i+1)/(solutionCollection.scenarioIds.length+1)/2));

                if (showScenarioNamesState)
                {
                    lineGroup.selectAll('symbol')
                    .data(solutionsState[i].objectiveVectors)
                    .enter()
                    .append('text')
                    .text(datum => datum.scenarioId)
                    .attr('x', datum => xScale(datum.objectiveValues[0]) + solutionDimensionsState.margin.left + 4)
                    .attr('y', datum => yScale(datum.objectiveValues[1]) + solutionDimensionsState.margin.top - 4)
                    .style('pointer-events', 'none');
                };

                const currentLegendY = legendCellsY0 + (solutionCollection.scenarioIds.length + 1.5 + i) * legendCellsHeight;

                legendContainer
                .append('text')
                .attr('x', legendCellsX0 + 20)
                .attr('y', currentLegendY + 4)
                // TODO: proper solution name
                .text(`Solution ${i+1}`);

                legendContainer
                .append('path')
                .attr('transform', `translate(${legendCellsX0}, ${currentLegendY})`)
                .attr('d', currentSymbol)
                .attr('fill', interpolateRainbow((i+1)/(solutionCollection.scenarioIds.length+1)/2));

            };



            /*
            for (let i = 0; i < solutionCollection.scenarioIds.length; i++)
            {
                legendContainer
                .append('text')
                .attr('x', )
            }
            */

            /*
            legendContainer
            .selectAll()
            .data(solutionCollection.scenarioIds)
            .enter()
            .append('text')
            .attr('id', (_,i) => `legend-text-${i+1}`)
            .attr('x', legendCellsX0 + 1.5*legendCellsWidth)
            .attr('y', (_,i) => legendCellsY0 + (i+0.5)*legendCellsHeight + 4)
            .style('text-anchor', 'left')
            .style('font-size', '12px')
            .text((_,i) => i+1)
            .style('fill', 'black');
            */


            };
    });

    //return <div ref={ref} id="container" className="component-container"/>;
    return <div ref={ref} id="container"/>;
};

export default SB_EAF;