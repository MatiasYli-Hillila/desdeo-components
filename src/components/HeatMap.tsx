import { useEffect, useRef, useState } from "react";
//import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { ScenarioBasedSolution, ScenarioBasedSolutionCollection } from "../types/ProblemTypes"
import { pointer } from "d3-selection";
import "d3-transition";
import "./Svg.css";
//import { extent } from "d3-array";
import { drag } from "d3-drag";

interface HeatMapProps {
    solutionCollection : ScenarioBasedSolutionCollection;
    width?: number;
    height?: number;
}

const HeatMap = ({solutionCollection} : HeatMapProps) => {
    const ref = useRef(null);

    // TODO: pluralize these?
    const [solutionState, setSolutionsState] = useState(solutionCollection.solutions);
    const [scenarioIdState, setScenarioIdState] = useState(solutionCollection.scenarioIds);
    const [objectiveIdState, setObjectiveIdState] = useState(solutionCollection.objectiveIds);

    // TODO: why does the list of removed solutions show the same solution twice on first removal?
    const [removedSolutionsState, setRemovedSolutionsState] = useState(Array<ScenarioBasedSolution>());

    useEffect(
        () => {
            setSolutionsState(solutionCollection.solutions);
        }, [solutionCollection.solutions]
    );

    useEffect(
        () => {
            setScenarioIdState(solutionCollection.scenarioIds);
        }, [solutionCollection.scenarioIds]
    );

    useEffect(
        () => {
            setObjectiveIdState(solutionCollection.objectiveIds);
        }, [solutionCollection.objectiveIds]
    );

    useEffect(() => {

        const defaultDimensions = {
            width: 300,
            height: 300,
            margin: {top: 80, right: 20, bottom: 20, left: 20}
        }

        const renderH =
        defaultDimensions.height + defaultDimensions.margin.bottom + defaultDimensions.margin.top;
            const renderW =
        defaultDimensions.width + defaultDimensions.margin.left + defaultDimensions.margin.right;

        // TODO: make these into their own object, move to another file, something else?
        var mouseoveredSolutionIndex: number | null = null;
        var currentDraggedSolutionIndex: number | null = null;
        var mouseoveredScenarioIndex: number | null = null;
        var currentDraggedScenarioIndex: number | null = null;
        

        // TODO: generalize the switch functions, they all do the same to different arrays
        // TODO: rename to maybe swapIndices or something.
        /**
         * Swaps indices i, j of solutionState. 
         */
        const switchSolutions = (i: number, j: number) => {
            const solutionStateCopy = [...solutionState];
            [solutionStateCopy[i], solutionStateCopy[j]] = [solutionStateCopy[j], solutionStateCopy[i]];
            //[solutionState[i], solutionState[j]] = [solutionState[j], solutionState[i]];
            setSolutionsState(solutionStateCopy);
        };

        const swapScenariosIndices = (i: number, j: number) => {
            [scenarioIdState[i], scenarioIdState[j]] = [scenarioIdState[j], scenarioIdState[i]];
        }

        const swapObjectiveIndices = (i: number, j: number) => {
            [objectiveIdState[i], objectiveIdState[j]] = [objectiveIdState[j], objectiveIdState[i]];
        }
        
        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();

        for (let i = 0; i < solutionState.length; i++) {
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('preserveAspectRatio', 'xMidYMin meet')
                .attr('viewBox', `0 0 ${renderW} ${renderH}`)
            .attr('id', solutionState[i].solutionId)
            .attr('width', defaultDimensions.width + defaultDimensions.margin.left + defaultDimensions.margin.right)
            .attr('height', defaultDimensions.height + defaultDimensions.margin.top + defaultDimensions.margin.bottom)
            .attr(
                "transform", 
                `translate(
                    ${defaultDimensions.margin.left*(i+1)*3+defaultDimensions.width*i},
                    ${defaultDimensions.margin.top}
                )`
            );

        const tooltipMouseover = () => {
                tooltip.style('visibility', 'visible');
        };
        const tooltipMousemove = (event : any, datum : any) => {
                const [x,y] = pointer(event);
                var percentOfIdealString = '';
                if (solutionCollection.objectiveIdeals.get(datum.objectiveId) === undefined) return;
                else if (solutionCollection.objectivesToMaximize.get(datum.objectiveId))
                    // TODO: figure out how to remove ts-ignore here
                    // @ts-ignore
                    percentOfIdealString = `solution/ideal (maximizing): ${(datum.objectiveValue / solutionCollection.objectiveIdeals.get(datum.objectiveId)).toFixed(2)}`;
                else 
                    // TODO: figure out how to remove ts-ignore here
                    // @ts-ignore
                    percentOfIdealString = `ideal/solution (minimizing): ${(solutionCollection.objectiveIdeals.get(datum.objectiveId) / datum.objectiveValue).toFixed(2)}`;
                tooltip
                    .html(`Value: ${datum.objectiveValue.toString()}; ${percentOfIdealString}`)
                    .style('left', `${x+20}px`)
                    .style('top', `${y-10}px`);
                    //.attr('transform', `translate(${x},${y})`);
        };
        const tooltipMouseleave = () => {
                tooltip.style('visibility', 'hidden');
        };

        // TODO: see if this can be done without eslint-disable 
        // eslint-disable-next-line no-loop-func
        const solutionMouseover = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const solutionId = target.classList.value;
            const solutionIndex = solutionState.findIndex(i => i.solutionId === solutionId);
            mouseoveredSolutionIndex = solutionIndex;
        };

        const scenarioMouseover = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
        }

        // TODO: see if this can be done without eslint-disable 
        // eslint-disable-next-line no-loop-func
        const dragStart = (wut: any) => {
            const solutionId = wut.sourceEvent.target.classList.value;
            const solutionIndex = solutionState.findIndex(i => i.solutionId === solutionId);
            currentDraggedSolutionIndex = solutionIndex;
        }

        //const dragEnd = (event: any) => {
        // eslint-disable-next-line no-loop-func
        const dragEnd = () => {
            if (mouseoveredSolutionIndex === null || currentDraggedSolutionIndex === null) return;
            else switchSolutions(currentDraggedSolutionIndex, mouseoveredSolutionIndex);
        }

        const removeSolution = (event: MouseEvent) => {
            const eventTarget = event.target as HTMLElement;
            const solutionId = eventTarget.parentElement?.id;
            console.log(solutionId);
            if (solutionState.length > 1) {
                const solutionToRemoveIndex = solutionState.findIndex(i => i.solutionId === solutionId);
                const solutionToRemove = solutionState[solutionToRemoveIndex];
                setSolutionsState([
                    ...solutionState.slice(0, solutionToRemoveIndex),
                    ...solutionState.slice(solutionToRemoveIndex + 1, solutionState.length)
                ]);
                //removedSolutionsState.push(solutionToRemove);
                setRemovedSolutionsState(state => [...state, solutionToRemove]);
            }
        }

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
            //solutionState.push(event.target.__data__);
            //removedSolutionsState.splice
            //setSolutionsState(solutionState);
        }

        const dragTest = drag()
            .on('start', dragStart)
            .on('end', dragEnd);

        const xScale = scaleBand()
            .range([0, defaultDimensions.width])
            .domain(solutionCollection.scenarioIds)
            .padding(0.01);
        const xAxis = axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(${defaultDimensions.margin.left},${defaultDimensions.height + defaultDimensions.margin.top})`)
            .call(xAxis);

        const yScale = scaleBand()
            .range([defaultDimensions.height, 0])
            .domain(solutionCollection.objectiveIds)
            .padding(0.01);
        const yAxis = axisLeft(yScale);
        svg.append("g")
            .attr('transform', `translate(${defaultDimensions.margin.left},${defaultDimensions.margin.top})`)
            .call(yAxis);

        if (svg === undefined) console.log('svg undefined');

        svg.append('text')
            .attr("x", (defaultDimensions.width / 2))             
            .attr("y", (defaultDimensions.margin.top / 2))
            .style("text-anchor", "middle") 
            .style("font-size", "16px") 
            .text(() => solutionState[i].solutionId.toString())
            .style('fill', 'black')
            .on('click', removeSolutionEvent => removeSolution(removeSolutionEvent))

        // TODO: figure out how to remove ts-ignore here
        // @ts-ignore
        svg.selectAll()
            .append('g')
            .data(solutionState[i].objectiveValues)
            .enter()
            .append('rect')
            .attr('class', solutionState[i].solutionId)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .attr('x', datum => xScale(datum.scenarioId) + defaultDimensions.margin.left)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .attr('y', datum => yScale(datum.objectiveId) + defaultDimensions.margin.top)
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => {
                if (solutionCollection.objectivesToMaximize.get(datum.objectiveId)) 
                    // TODO: calculate solutions.objectiveIdeals from the biggest/smallest value if not provided
                    // TODO: fix these calculations
                    // TODO: figure out how to remove ts-ignore here.
                    // @ts-ignore
                    return interpolateBlues(datum.objectiveValue / solutionCollection.objectiveIdeals.get(datum.objectiveId));
                else 
                    // TODO: figure out how to remove ts-ignore here.
                    // @ts-ignore
                    return interpolateBlues(solutionCollection.objectiveIdeals.get(datum.objectiveId) / datum.objectiveValue);
            })
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', (d) => {
                tooltipMouseover(); 
                solutionMouseover(d);
            })
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .call(dragTest);
        
        const test = svgContainer.append('g')
            .attr("transform", `translate(${defaultDimensions.margin.left},${defaultDimensions.height + defaultDimensions.margin.top})`)
            .append('ul'); 

        test//.selectAll()
            .selectAll('li')
            .data(removedSolutionsState)
            .enter()
            .append('li')
            .on('click', mouseEvent => addSolutionBack(mouseEvent))
            .text(d => d.solutionId);
//.text('asdf')

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
            // TODO: is this a hack?
            .style('z-index', 1000);

        //const legendColors = [interpolateBlues(1), interpolateBlues(0)];
        //var todoChangeNameOfThis = extent(legendColors, d => d.value);
        /*

        const legendDimensions = {
            width: 28,
            height: 84,
            margin: {top: 20, right: 20, bottom: 20, left: 20}
        };
        
        const legend = svgContainer
            .append('defs')
            .append('linearGradient')
        */

            /*
        const legendGradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'legendGradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%');

        legendGradient.append('stop')
            .attr('class', 'start')
            .attr('offset', '0%')
            .attr('stop-color', legendColors[0])
            .attr('stop-opacity', 1);

        legendGradient.append('stop')
            .attr('class', 'end')
            .attr('offset', '100%')
            .attr('stop-color', 'blue')
            .attr('stop-opacity', 1);

        svg.append('g')
            //.selectAll('g')
            //.data(legendColors)
            //.enter()
            .append('rect')
            .attr('width', 28)
            .attr('height', 64)
            .attr('x', defaultDimensions.width + defaultDimensions.margin.right)
            .attr('y', defaultDimensions.height/2 - 64/2)
            .style('fill', 'url(#legendGradient)')
        */
        }
        
    });

    return <div ref={ref} id="container" className="component-container"/>
}; 

export default HeatMap;