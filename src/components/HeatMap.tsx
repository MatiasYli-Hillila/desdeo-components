import { useEffect, useRef, useState } from "react";

import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { pointer } from "d3-selection";
import { drag } from "d3-drag";
import "d3-transition";

import { ScenarioBasedObjectiveValue, ScenarioBasedSolution, ScenarioBasedSolutionCollection } from "../types/ProblemTypes"
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
    solutionCollection : ScenarioBasedSolutionCollection;
    solutionDimensions?: solutionDimensions
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
    
    // TODO: this goes over column 120, but reindenting breaks if it's not oneliner
    const [solutionDimensionsState, setSolutionDimensionsState] = useState(solutionDimensions ? solutionDimensions : solutionDefaultDimensions);
    const [solutionsState, setSolutionsState] = useState(solutionCollection.solutions);
    // TODO: why does the list of removed solutions show the same solution twice on first removal?
    const [removedSolutionsState, setRemovedSolutionsState] = useState(Array<ScenarioBasedSolution>());
    const [scenarioIdsState, setScenarioIdsState] = useState(solutionCollection.scenarioIds);
    const [objectiveIdsState, setObjectiveIdsState] = useState(solutionCollection.objectiveIds);
    
    // TODO: generalize the index swap functions, they all do the same to different arrays
    //#region index swap functions
    
    // TODO: rename swapSolutions to swapSolutionIndices
    /**
    * Swaps indices i, j of solutionsState. 
    */
    const swapSolutions = (i: number, j: number) => {
        const solutionsStateCopy = [...solutionsState];
        [solutionsStateCopy[i], solutionsStateCopy[j]] = [solutionsStateCopy[j], solutionsStateCopy[i]];
        setSolutionsState(solutionsStateCopy);
    };
    
    // TODO: rename swapScenariosIndices to swapScenarioIndices
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
    
    /* Render the component */
    useEffect(() => {
        
        const renderW = solutionDimensionsState.width + solutionDimensionsState.margin.left + solutionDimensionsState.margin.right;
        const renderH = solutionDimensionsState.height + solutionDimensionsState.margin.bottom + solutionDimensionsState.margin.top;
        
        // TODO: make these into their own object, move to another file, something else?
        var mouseoveredSolutionIndex: number | null = null;
        var currentDraggedSolutionIndex: number | null = null;
        
        var mouseoveredScenarioIndex: number | null = null;
        var currentDraggedScenarioIndex: number | null = null;
        
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
            const [x,y] = pointer(event);
            var percentOfIdealString = 'goodness% ';
            if (solutionCollection.objectiveIdeals === undefined) return;
            else if (solutionCollection.objectivesToMaximize.get(datum.objectiveId))
            {
                percentOfIdealString += `(maximizing): ${
                    (datum.objectiveValue / solutionCollection.objectiveIdeals.get(datum.objectiveId)!).toFixed(2)
                }`;
            }
            
            else 
            {
                percentOfIdealString += `(minimizing): ${(
                    solutionCollection.objectiveIdeals.get(datum.objectiveId)! / datum.objectiveValue).toFixed(2)
                }`;
            }
            tooltip
            .html(`Value: ${datum.objectiveValue.toString()}</br> ${percentOfIdealString}`)
            .style('left', `${x+20}px`)
            .style('top', `${y-10}px`);
        };

        //#endregion
            
        for (let i = 0; i < solutionsState.length; i++) {
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('id', solutionsState[i].solutionId)
            .attr('width', renderW)
            .attr('height', renderH)
            
            
            // TODO: refactor mouseover functions to be more general, they have copypasted code
            
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const solutionMouseover = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const solutionId = target.classList.value;
                const solutionIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                mouseoveredSolutionIndex = solutionIndex;
            };
            
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const solutionDragStart = (wut: any) => {
                const solutionId = wut.sourceEvent.target.classList.value;
                const solutionIndex = solutionsState.findIndex(i => i.solutionId === solutionId);
                currentDraggedSolutionIndex = solutionIndex;
            }
            
            //const dragEnd = (event: any) => {
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const solutionDragEnd = () => {
                if (mouseoveredSolutionIndex === null || currentDraggedSolutionIndex === null) return;
                else swapSolutions(currentDraggedSolutionIndex, mouseoveredSolutionIndex);
            }
            
            const solutionDrag = drag()
            .on('start', solutionDragStart)
            .on('end', solutionDragEnd);
            
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const scenarioMouseover = (event: MouseEvent) => {
                var target = event.target as HTMLElement;
                const scenarioId = target.classList.value;
                const scenarioIndex = scenarioIdsState.findIndex(i => i === scenarioId);
                mouseoveredScenarioIndex = scenarioIndex;
                console.log(`mouseoveredScenarioIndex: ${mouseoveredScenarioIndex}`);
            }
            
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const scenarioDragStart = (event: MouseEvent) => {
                // TODO: figure out how to remove ts-ignore here
                // @ts-ignore
                const scenarioId = event.sourceEvent.target.classList.value;
                const scenarioIndex = scenarioIdsState.findIndex(i => i === scenarioId);
                currentDraggedScenarioIndex = scenarioIndex;
                console.log(`currentDraggedScenarioIndex: ${currentDraggedScenarioIndex}`);
            }
            
            // TODO: see if this can be done without eslint-disable 
            // eslint-disable-next-line no-loop-func
            const scenarioDragEnd = () => {
                if (mouseoveredScenarioIndex === null || currentDraggedScenarioIndex === null) return;
                // TODO: swap the order of the parameters in this call
                else swapScenariosIndices(currentDraggedScenarioIndex, mouseoveredScenarioIndex);
            }
            
            const scenarioDrag = drag()
            .on('start', scenarioDragStart)
            .on('end', scenarioDragEnd);
            
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
            }
            
            const xScale = scaleBand()
            .range([0, solutionDimensionsState.width])
            .domain(scenarioIdsState)
            .padding(0.01);
            const xAxis = axisBottom(xScale);
            
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            svg.append("g")
            .attr("transform", `translate(${solutionDimensionsState.margin.left},${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
            .call(xAxis)
            .selectAll('text')
            .attr('class', d => d)
            .on('mouseover', scenarioMouseover)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .call(scenarioDrag);
            
            const yScale = scaleBand()
            .range([solutionDimensionsState.height, 0])
            .domain(solutionCollection.objectiveIds)
            .padding(0.01);
            const yAxis = axisLeft(yScale);
            svg.append("g")
            .attr('transform', `translate(${solutionDimensionsState.margin.left},${solutionDimensionsState.margin.top})`)
            .call(yAxis);
            
            if (svg === undefined) console.log('svg undefined');
            
            svg.append('text')
            .attr("x", (solutionDimensionsState.width / 2))             
            .attr("y", (solutionDimensionsState.margin.top / 2))
            .style("text-anchor", "middle") 
            .style("font-size", "16px") 
            .text(() => solutionsState[i].solutionId.toString())
            .style('fill', 'black')
            .on('click', removeSolutionEvent => removeSolution(removeSolutionEvent))
            
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            svg.selectAll()
            .append('g')
            .data(solutionsState[i].objectiveValues)
            .enter()
            .append('rect')
            .attr('class', solutionsState[i].solutionId)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .attr('x', datum => xScale(datum.scenarioId) + solutionDimensionsState.margin.left)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .attr('y', datum => yScale(datum.objectiveId) + solutionDimensionsState.margin.top)
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => {
                if (solutionCollection.objectivesToMaximize.get(datum.objectiveId)) 
                // TODO: calculate solutions.objectiveIdeals from the biggest/smallest value if not provided
                // TODO: use Math.abs instead
                return interpolateBlues(
                    // TODO: figure out how to remove ts-ignore here.
                    // @ts-ignore
                    (datum.objectiveValue - solutionCollection.objectiveNadirs.get(datum.objectiveId)) / 
                    // @ts-ignore
                    (solutionCollection.objectiveIdeals.get(datum.objectiveId) - solutionCollection.objectiveNadirs.get(datum.objectiveId))
                    );
                    else 
                    return interpolateBlues(
                        // @ts-ignore
                        (datum.objectiveValue - solutionCollection.objectiveNadirs.get(datum.objectiveId)) / 
                        // @ts-ignore
                        (solutionCollection.objectiveIdeals.get(datum.objectiveId) - solutionCollection.objectiveNadirs.get(datum.objectiveId))
                        );
                    })
                    .on('mousemove', tooltipMousemove)
                    .on('mouseleave', tooltipMouseleave)
                    .on('mouseover', (d) => {
                        tooltipMouseover(); 
                        solutionMouseover(d);
                    })
                    // TODO: figure out how to remove ts-ignore here
                    // @ts-ignore
                    .call(solutionDrag);
                    
                    const test = svgContainer.append('g')
                    .attr("transform", `translate(${solutionDimensionsState.margin.left},${solutionDimensionsState.height + solutionDimensionsState.margin.top})`)
                    .append('ul'); 
                    
                    test//.selectAll()
                    .selectAll('li')
                    .data(removedSolutionsState)
                    .enter()
                    .append('li')
                    .on('click', mouseEvent => addSolutionBack(mouseEvent))
                    .text(d => d.solutionId);
                    
                    //#region legend
                    
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
                    .attr('x', solutionDimensionsState.width + solutionDimensionsState.margin.right)
                    .attr('y', solutionDimensionsState.height/2 - 64/2)
                    .style('fill', 'url(#legendGradient)')
                    */
                    
                    //#endregion
                    
                }
                
    });
            
    return <div ref={ref} id="container" className="component-container"/>
}; 
        
export default HeatMap;