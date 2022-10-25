import { useEffect, useRef, useState } from "react";

import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { drag } from "d3-drag";
import "d3-transition";

import {
    ScenarioBasedObjectiveValue,
    ScenarioBasedSolutionUsingObjectiveValues,
    ScenarioBasedSolutionCollectionUsingObjectiveValuesArray
} from "../types/ProblemTypes";

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

interface HeatMapProps {
    solutionCollection : ScenarioBasedSolutionCollectionUsingObjectiveValuesArray;
    solutionDimensions?: solutionDimensions;
};

const HeatMap = ({solutionCollection, solutionDimensions} : HeatMapProps) => {
    const ref = useRef(null);
    const solutionDefaultDimensions: solutionDimensions = {
        width: 300,
        height: 300,
        margin: {
            top: 80,
            right: 20,
            bottom: 20,
            left: 80
        }
    };

    // TODO: Line over 120
    const [
        solutionDimensionsState,
        setSolutionDimensionsState
    ] = useState(solutionDimensions ? solutionDimensions : solutionDefaultDimensions);
    const [solutionsState, setSolutionsState] = useState(solutionCollection.solutions);
    const [removedSolutionsState, setRemovedSolutionsState] = useState(Array<ScenarioBasedSolutionUsingObjectiveValues>());
    const [scenarioIdsState, setScenarioIdsState] = useState(solutionCollection.scenarioIds);
    const [objectiveIdsState, setObjectiveIdsState] = useState(solutionCollection.objectiveIds);

    // TODO: Generalize the index swap functions, they all do the same to different arrays
    //#region index swap functions

    // TODO: Rename swapSolutions to swapSolutionIndices
    /**
    * Swaps indices i, j of solutionsState.
    */
    const swapSolutions = (i: number, j: number) => {
        const solutionsStateCopy = [...solutionsState];
        [solutionsStateCopy[i], solutionsStateCopy[j]] = [solutionsStateCopy[j], solutionsStateCopy[i]];
        setSolutionsState(solutionsStateCopy);
    };

    // TODO: Rename swapScenariosIndices to swapScenarioIndices
    /**
    * Swaps indices i, j of scenarioIdsState.
    */
    const swapScenariosIndices = (i: number, j: number) => {
        const scenarioIdsStateCopy = [...scenarioIdsState];
        [scenarioIdsStateCopy[i], scenarioIdsStateCopy[j]] = [scenarioIdsStateCopy[j], scenarioIdsStateCopy[i]];
        setScenarioIdsState(scenarioIdsStateCopy);
    };

    /**
    * Swaps indices i, j of objectiveIdsState.
    */
    const swapObjectiveIndices = (i: number, j: number) => {
        const objectiveIdsStateCopy = [...objectiveIdsState];
        [objectiveIdsStateCopy[i], objectiveIdsStateCopy[j]] = [objectiveIdsStateCopy[j], objectiveIdsStateCopy[i]];
        setObjectiveIdsState(objectiveIdsStateCopy);
    };

    //#endregion

    useEffect(() => setSolutionsState(solutionCollection.solutions), [solutionCollection.solutions]);
    useEffect(() => setScenarioIdsState(solutionCollection.scenarioIds), [solutionCollection.scenarioIds]);
    useEffect(() => setObjectiveIdsState(solutionCollection.objectiveIds), [solutionCollection.objectiveIds]);

    // TODO: Make these into their own object, move to another file, something else? Remove useRef? Generalize?
    var mouseoveredSolutionIndex = useRef<number>(null!);
    var currentDraggedSolutionIndex = useRef<number>(null!);
    var mouseoveredScenarioIndex = useRef<number>(null!);
    var currentDraggedScenarioIndex = useRef<number>(null!);
    var mouseoveredObjectiveIndex = useRef<number>(null!);
    var currentDraggedObjectiveIndex = useRef<number>(null!);

    const renderW =
        solutionDimensionsState.width + solutionDimensionsState.margin.left + solutionDimensionsState.margin.right;
    const renderH =
        solutionDimensionsState.height + solutionDimensionsState.margin.bottom + solutionDimensionsState.margin.top;

    /* Render the component */
    useEffect(() => {

        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();

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

        const tooltipMouseover = () => tooltip.style('visibility', 'visible');
        const tooltipMouseleave = () => tooltip.style('visibility', 'hidden');

        const tooltipMousemove = (event : MouseEvent, datum : ScenarioBasedObjectiveValue) => {
            const [x,y] = [event.pageX, event.pageY];
            var percentOfIdealString = 'goodness% ';

            if (solutionCollection.objectiveIdeals === undefined)
            {
                return;
            }
            else if (solutionCollection.objectivesToMaximize.get(datum.objectiveId))
            {
                percentOfIdealString += `(maximizing): ${
                    ((datum.objectiveValue - solutionCollection.objectiveNadirs.get(datum.objectiveId)!) /
                    (solutionCollection.objectiveIdeals.get(datum.objectiveId)! - solutionCollection.objectiveNadirs.get(datum.objectiveId)!))
                    .toFixed(2)
                }`;
            }
            else
            {
                percentOfIdealString += `(minimizing): ${
                    ((solutionCollection.objectiveNadirs.get(datum.objectiveId)! - datum.objectiveValue) /
                    (solutionCollection.objectiveNadirs.get(datum.objectiveId)! - solutionCollection.objectiveIdeals.get(datum.objectiveId)!))
                    .toFixed(2)
                }`;
            }

            tooltip
            .html(`Value: ${datum.objectiveValue.toString()}</br></br> ${percentOfIdealString}`);

            tooltip
            .style('left', `${x+20}px`)
            .style('top', `${y-10}px`);
        };

        //#endregion

        //#region legend

        const legendColors = [interpolateBlues(0), interpolateBlues(1)];

        const legendSVG = svgContainer.append('svg').classed('svg-content', true)
        .attr('width', 100 + 20)
        .attr('height', 400);
        //.style('outline', 'thick solid #FFFFFF');


        const legendGradient = legendSVG.append('defs')
        .append('linearGradient')
        .attr('id', 'legendGradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

        legendGradient.append('stop')
        .attr('class', 'start')
        .attr('offset', '0%')
        .attr('stop-color', legendColors[1])
        .attr('stop-opacity', 1);

        legendGradient.append('stop')
        .attr('class', 'end')
        .attr('offset', '100%')
        .attr('stop-color', legendColors[0])
        .attr('stop-opacity', 1);

        legendSVG//.append('g')
        //.classed('svg-content', true)
        //.attr('width', renderW)
        //.attr('height', renderH)
        .append('rect')
        .attr('width', 98)
        .attr('height', 398)
        .attr('x', 1)
        .attr('y', 1)
        //.attr('x', solutionDimensionsState.width + solutionDimensionsState.margin.right)
        //.attr('y', solutionDimensionsState.height/2 - 64/2)
        .style('fill', 'url(#legendGradient)')
        .style('outline', 'thin solid #000000');


        legendSVG.append('text')
        .attr("x", 50)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text(() => 'ideal')
        .style('fill', legendColors[0])

        legendSVG.append('text')
        .attr("x", 50)
        .attr("y", 390)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text(() => 'nadir')
        .style('fill', legendColors[1])

        //#endregion

        //#region removed solutions list

        const addSolutionBack = (event: MouseEvent) => {
            const eventTarget = event.target as HTMLElement;
            console.log('addSolutionBack');
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

        // TODO: Use different class? Make this work better (i.e. margins); ADD OUTLINE.
        const removedSolutionsList = svgContainer.append('g').classed('svg-content', true)
        //.attr('transform', `translate(${solutionDimensionsState.margin.left}, 0`)
        //.attr("transform", `translate(${solutionDimensionsState.margin.left},${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
        //.attr('x', 50)
        .attr('width', 100)
        .attr('height', 400)
        //.style('outline', 'thick solid #FFFFFF')
        .append('text')
        .attr('x', 50)
        .attr('y', 20)
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(() => 'Removed solutions')
        .style('fill', 'black')
        .append('ul')
        //.attr('width', 100)
        //.attr('height', 400)
        //.attr('x', 0)
        .attr('y', 50);

        removedSolutionsList.selectAll('li')
        .data(removedSolutionsState)
        .enter()
        .append('li')
        .on('click', mouseEvent => addSolutionBack(mouseEvent))
        .text(d => d.solutionId);

        //#endregion

        for (let i = 0; i < solutionsState.length; i++) {
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('id', solutionsState[i].solutionId)
            .attr('width', renderW)
            .attr('height', renderH)

            if (svg === undefined) console.log('svg undefined');

            //#region mouse functions

            // TODO: Refactor mouseover functions to be more general, they have copypasted code
            const solutionMouseover = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const solutionId = target.classList.value;
                const solutionIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                mouseoveredSolutionIndex.current = solutionIndex;
            };

            const solutionDragStart = (dragStartobject: any) => {
                const solutionId = dragStartobject.sourceEvent.target.classList.value;
                const solutionIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                currentDraggedSolutionIndex.current = solutionIndex;
            };

            const solutionDragEnd = () => {
                if (mouseoveredSolutionIndex.current === null || currentDraggedSolutionIndex.current === null) return;
                else swapSolutions(currentDraggedSolutionIndex.current, mouseoveredSolutionIndex.current);
            };

            const solutionDrag = drag()
            .on('start', solutionDragStart)
            .on('end', solutionDragEnd);

            const scenarioMouseover = (event: MouseEvent) => {
                var target = event.target as HTMLElement;
                const scenarioId = target.classList.value;
                const scenarioIndex = scenarioIdsState.findIndex(i => i === scenarioId);
                mouseoveredScenarioIndex.current = scenarioIndex;
            };

            const scenarioDragStart = (dragStartObject: any) => {
                const scenarioId = dragStartObject.sourceEvent.target.classList.value;
                const scenarioIndex = scenarioIdsState.findIndex(i => i === scenarioId);
                currentDraggedScenarioIndex.current = scenarioIndex;
            };

            const scenarioDragEnd = () => {
                if (mouseoveredScenarioIndex.current === null || currentDraggedScenarioIndex.current === null) return;
                else swapScenariosIndices(mouseoveredScenarioIndex.current, currentDraggedScenarioIndex.current);
            };

            const scenarioDrag = drag()
            .on('start', scenarioDragStart)
            .on('end', scenarioDragEnd);

            const objectiveMouseover = (event: MouseEvent) => {
                var target = event.target as HTMLElement;
                const objectiveId = target.classList.value;
                const objectiveIndex = objectiveIdsState.findIndex(i => i === objectiveId);
                mouseoveredObjectiveIndex.current = objectiveIndex;
            };

            const objectiveDragStart = (dragStartObject: any) => {
                const objectiveId = dragStartObject.sourceEvent.target.classList.value;
                const objectiveIndex = objectiveIdsState.findIndex(i => i === objectiveId);
                currentDraggedObjectiveIndex.current = objectiveIndex;
            };

            const objectiveDragEnd = () => {
                if (mouseoveredObjectiveIndex.current === null || currentDraggedObjectiveIndex.current === null) return;
                else swapObjectiveIndices(mouseoveredObjectiveIndex.current, currentDraggedObjectiveIndex.current);
            };

            const objectiveDrag = drag()
            .on('start', objectiveDragStart)
            .on('end', objectiveDragEnd);

            const removeSolution = (event: MouseEvent) => {
                const eventTarget = event.target as HTMLElement;
                const solutionId = eventTarget.parentElement?.id;
                console.log(`solutionId: ${solutionId}`);
                if (solutionsState.length > 1) {
                    const solutionToRemoveIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                    const solutionToRemove = solutionsState[solutionToRemoveIndex];
                    setSolutionsState([
                        ...solutionsState.slice(0, solutionToRemoveIndex),
                        ...solutionsState.slice(solutionToRemoveIndex + 1, solutionsState.length)
                    ]);
                    setRemovedSolutionsState(state => [...state, solutionToRemove]);
                }
            }

            //#endregion

            const xScale = scaleBand()
            .range([0, solutionDimensionsState.width])
            .domain(scenarioIdsState)
            .padding(0.01);
            const xAxis = axisBottom(xScale);

            // TODO: Refactor ts-ignore away
            // @ts-ignore
            svg
            .append("g")
            .attr(
                "transform",
                `translate(
                    ${solutionDimensionsState.margin.left},
                    ${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
            .call(xAxis)
            .selectAll('text')
            .attr('class', d => d)
            .on('mouseover', scenarioMouseover)
            // TODO: Refactor ts-ignore away
            // @ts-ignore
            .call(scenarioDrag);

            const yScale = scaleBand()
            .range([solutionDimensionsState.height, 0])
            .domain(objectiveIdsState)
            .padding(0.01);
            const yAxis = axisLeft(yScale);

            // TODO: Refactor ts-ignore away
            // @ts-ignore
            svg
            .append("g")
            .attr(
                'transform',
                `translate(
                    ${solutionDimensionsState.margin.left},
                    ${solutionDimensionsState.margin.top})`)
            .call(yAxis)
            .selectAll('text')
            .attr('class', d => d)
            .on('mouseover', objectiveMouseover)
            // TODO: Refactor ts-ignore away
            // @ts-ignore
            .call(objectiveDrag);

            svg.append('text')
            .attr("x", (solutionDimensionsState.width / 2 + solutionDimensionsState.margin.left))
            .attr("y", (solutionDimensionsState.margin.top / 2))
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .text(() => solutionsState[i].solutionId.toString())
            .style('fill', 'black')
            .on('click', removeSolutionEvent => removeSolution(removeSolutionEvent));

            svg.selectAll()
            .append('g')
            .data(solutionsState[i].objectiveValues)
            .enter()
            .append('rect')
            .attr('class', solutionsState[i].solutionId)
            .attr('x', datum => xScale(datum.scenarioId)! + solutionDimensionsState.margin.left)
            .attr('y', datum => yScale(datum.objectiveId)! + solutionDimensionsState.margin.top)
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => {
                const nadir = solutionCollection.objectiveNadirs.get(datum.objectiveId)!;
                const ideal = solutionCollection.objectiveIdeals.get(datum.objectiveId)!;
                return interpolateBlues((datum.objectiveValue - nadir) / (ideal - nadir));
            })
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', (d) => {
                tooltipMouseover();
                solutionMouseover(d);
            })
            // TODO: Refactor ts-ignore away
            // @ts-ignore
            .call(solutionDrag);
        };

    });

    return <div ref={ref} id="container" className="component-container"/>
};

export default HeatMap;