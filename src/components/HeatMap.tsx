import { useEffect, useRef, useState } from "react";
//import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { ScenarioBasedSolutionCollection } from "../types/ProblemTypes"
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

    const [solutionState, setSolutionsState] = useState(solutionCollection);

    useEffect(() => {
        setSolutionsState(solutionCollection)
    }, [solutionCollection]);

    //var currentDraggedSolutionPosition = [0,0];
    //var mouseoveredSolution: any = null;
    //var currentDraggedSolution: any = null;
    

    
    

    /* 
    const switchTwoSolutionElements = (element1: Element, element2: Element) => {
        console.log(`element1: ${element1}, element2: ${element2}`);
        const temp = element1;
        element1 = element2;
        element2 = temp;
    };
    */

    useEffect(() => {

        const defaultDimensions = {
            width: 300,
            height: 300,
            margin: {top: 80, right: 20, bottom: 20, left: 20}
        }

        var mouseoveredSolutionIndex: number | null = null;
        var currentDraggedSolutionIndex: number | null = null;

        const switchSolutions = (i: number, j: number) => {
            [solutionState.solutions[i], solutionState.solutions[j]] = [solutionState.solutions[j], solutionState.solutions[i]];
            setSolutionsState(solutionCollection);
        };

        //switchSolutions(solutionCollection, 0,1);
        
            //.classed('component-container', true);

        //svgContainer.selectAll('*').remove();

        for (let i = 0; i < solutionState.solutions.length; i++) {
            const svgContainer = select(ref.current)
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('id', solutionState.solutions[i].solutionId)
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
                if (solutionState.objectiveIdeals.get(datum.objectiveId) === undefined) return;
                else if (solutionState.objectivesToMaximize.get(datum.objectiveId))
                    // TODO: figure out how to remove ts-ignore here
                    // @ts-ignore
                    percentOfIdealString = `solution/ideal (maximizing): ${(datum.objectiveValue / solutionState.objectiveIdeals.get(datum.objectiveId)).toFixed(2)}`;
                else 
                    // TODO: figure out how to remove ts-ignore here
                    // @ts-ignore
                    percentOfIdealString = `ideal/solution (minimizing): ${(solutionState.objectiveIdeals.get(datum.objectiveId) / datum.objectiveValue).toFixed(2)}`;
                tooltip
                    .html(`Value: ${datum.objectiveValue.toString()}; ${percentOfIdealString}`)
                    .style('left', `${x+20}px`)
                    .style('top', `${y-10}px`);
                    //.attr('transform', `translate(${x},${y})`);
        };
        const tooltipMouseleave = () => {
                tooltip.style('visibility', 'hidden');
        };

        const solutionMouseover = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const solutionId = target.classList.value;
            const solutionIndex = solutionState.solutions.findIndex(i => i.solutionId === solutionId);
            mouseoveredSolutionIndex = solutionIndex;
        };

        // TODO: see if this can be done without eslint-disable 
        // eslint-disable-next-line no-loop-func
        const dragStart = (wut: any) => {
            //console.log('Drag started')
            const solutionId = wut.sourceEvent.target.classList.value;
            const solutionIndex = solutionState.solutions.findIndex(i => i.solutionId === solutionId);
            currentDraggedSolutionIndex = solutionIndex;
            //currentDraggedSolution = wut.sourceEvent.srcElement.parentElement;
            //console.log(`currentDraggedSolution: ${currentDraggedSolution}`);
            //currentDraggedSolutionPosition = [event.x, event.y];
            
            //console.log(event.x, event.y);
            //console.log(currentDraggedSolutionPosition);
        }

        
        /* const dragMove = (event: any) => {
            
            
            console.log(`
                event.target: ${event.target}
                event.type: ${event.type}
                event.subject: ${event.subject}
                event.x: ${event.x}
                event.y: ${event.y}
                event.dx: ${event.dx}
                event.dy: ${event.dy}
                event.identifier: ${event.identifier}
                event.active: ${event.active}
                event.sourceEvent: ${event.sourceEvent}
            `);
            
           //console.log(event.subject.)
           //var svg = select('svg');
                const mouseovered = document.elementFromPoint(event.x, event.y);
                if (mouseovered === null) return;
                console.log(mouseovered.tagName);
            
        }; */

        //const dragEnd = (event: any) => {
        // eslint-disable-next-line no-loop-func
        const dragEnd = () => {
            if (mouseoveredSolutionIndex === null || currentDraggedSolutionIndex === null) return;
            else switchSolutions(currentDraggedSolutionIndex, mouseoveredSolutionIndex);
            //switchTwoSolutionElements(currentDraggedSolution, mouseoveredSolution);
            
            //setSolutionsState(i: number, j: number => {})
            /*
            var switchSolutions = (solutionsCollection: ScenarioBasedSolutionCollection, i: number, j: number) => {
                [solutions.solutions[i], solutions.solutions[j]] = [solutions.solutions[j], solutions.solutions[i]];
            }
            */
            
        }

        const dragTest = drag()
            .on('start', dragStart)
            //.on('drag', dragMove)
            .on('end', dragEnd);

        const xScale = scaleBand()
            .range([0, defaultDimensions.width])
            .domain(solutionState.scenarioIds)
            .padding(0.01);
        const xAxis = axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(0,${defaultDimensions.height})`)
            .call(xAxis);

        const yScale = scaleBand()
            .range([defaultDimensions.height, 0])
            .domain(solutionState.objectiveIds)
            .padding(0.01);
        const yAxis = axisLeft(yScale);
        svg.append("g")
            //.attr('transform', `translate(${defaultDimensions.margin.left},0)`)
            //.attr('x', -60)
            //.style('fill', 'red')
            .call(yAxis);

        if (svg === undefined) console.log('svg undefined');

        svg.append('g').append('text')

            .attr("x", (defaultDimensions.width / 2))             
        .attr("y", 0 - (defaultDimensions.margin.top / 2))
        .style("text-anchor", "middle") 
        //.style("font-size", "16px") 
        //.style("text-decoration", "underline")  
        .text(() => solutionState.solutions[i].solutionId.toString())
        //.text(() => 'asdf')
        .style('fill', 'black')

        // TODO: figure out how to remove ts-ignore here
        // @ts-ignore
        svg.selectAll()
            .append('g')
            .data(solutionState.solutions[i].objectiveValues)
            .enter()
            .append('rect')
            .attr('class', solutionState.solutions[i].solutionId)
            .attr('x', datum => xScale(datum.scenarioId))
            .attr('y', datum => yScale(datum.objectiveId))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => {
                if (solutionState.objectivesToMaximize.get(datum.objectiveId)) 
                    // TODO: calculate solutions.objectiveIdeals from the biggest/smallest value if not provided
                    // TODO: figure out how to remove ts-ignore here.
                    // @ts-ignore
                    return interpolateBlues(datum.objectiveValue / solutionState.objectiveIdeals?.get(datum.objectiveId));
                else 
                    // @ts-ignore
                    return interpolateBlues(solutionState.objectiveIdeals?.get(datum.objectiveId) / datum.objectiveValue);
            })
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', (d) => {
                tooltipMouseover(); 
                solutionMouseover(d);
            })
            //.on('mouseover', solutionMouseover)
            // TODO: figure out how to remove ts-ignore here
            // @ts-ignore
            .call(dragTest);
            
            /**/

        const legendColors = [interpolateBlues(1), interpolateBlues(0)];
        // TODO: what does this actually do?
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
            
        }
        
        
        
        
    //}, [solutionCollection, solutionsState]);
    });

    return <div ref={ref} id="container" className="component-container"/>
}; 

export default HeatMap;