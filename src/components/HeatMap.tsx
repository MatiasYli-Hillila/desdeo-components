import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import { ScenarioBasedSolutionCollection } from "../types/ProblemTypes"
import { pointer } from "d3-selection";
import "d3-transition";
import "./Svg.css";
import { extent } from "d3-array";

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
        margin: {top: 80, right: 20, bottom: 20, left: 20}
    }       

    const switchSolutions = (i: number, j: number) => {
        [solutions.solutions[i], solutions.solutions[j]] = [solutions.solutions[j], solutions.solutions[i]];
    }

    useEffect(() => {

        //switchSolutions(0,1);
        
            //.classed('component-container', true);

        //svgContainer.selectAll('*').remove();

        for (let i = 0; i < solutions.solutions.length; i++) {
            const svgContainer = select(ref.current)
            const svg = svgContainer
            .append('svg')
            .classed('svg-content', true)
            .attr('width', defaultDimensions.width + defaultDimensions.margin.left + defaultDimensions.margin.right)
            .attr('height', defaultDimensions.height + defaultDimensions.margin.top + defaultDimensions.margin.bottom)
            .attr(
                "transform", 
                `translate(
                    ${defaultDimensions.margin.left*(i+1)*3+defaultDimensions.width*i},
                    ${defaultDimensions.margin.top}
                )`
            );

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
            .style('position', 'absolute');

        const tooltipMouseover = 
            () => {
                tooltip.style('visibility', 'visible');
            }
        const tooltipMousemove = 
            (event : any, datum : any) => {
                const [x,y] = pointer(event);
                var percentOfIdealString = '';
                if (solutions.objectiveIdeals?.get(datum.objectiveId) === undefined) return;
                else if (solutions.objectivesToMaximize.get(datum.objectiveId))
                    percentOfIdealString = `solution/ideal (maximizing): ${(datum.objectiveValue / solutions.objectiveIdeals?.get(datum.objectiveId)).toFixed(2)}`;
                else 
                    percentOfIdealString = `ideal/solution (minimizing): ${(solutions.objectiveIdeals?.get(datum.objectiveId) / datum.objectiveValue).toFixed(2)}`;
                tooltip
                    .html(`Value: ${datum.objectiveValue.toString()}; ${percentOfIdealString}`)
                    .style('left', `${x+20}px`)
                    .style('top', `${y-10}px`);
                    //.attr('transform', `translate(${x},${y})`);
            }
        const tooltipMouseleave = 
            () => {
                tooltip.style('visibility', 'hidden');
            }

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
            //.attr('transform', `translate(${defaultDimensions.margin.left},0)`)
            //.attr('x', -60)
            //.style('fill', 'red')
            .call(yAxis);

        if (svg === undefined) console.log('svg undefined');

            
        svg.selectAll()
            .data(solutions.solutions[i])
            .enter()
            .append('rect')
            .attr('x', datum => xScale(datum.scenarioId))
            .attr('y', datum => yScale(datum.objectiveId))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', datum => {
                if (solutions.objectivesToMaximize.get(datum.objectiveId)) 
                    // TODO: calculate solutions.objectiveIdeals from the biggest/smallest value if not provided
                    return interpolateBlues(datum.objectiveValue / solutions.objectiveIdeals?.get(datum.objectiveId));
                else 
                    return interpolateBlues(solutions.objectiveIdeals?.get(datum.objectiveId) / datum.objectiveValue);
            })
            .on('mousemove', tooltipMousemove)
            .on('mouseleave', tooltipMouseleave)
            .on('mouseover', tooltipMouseover)
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
        }
        
        
    });

    return <div ref={ref} id="container" className="component-container"/>
}; 

export default HeatMap;