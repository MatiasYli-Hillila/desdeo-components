import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { interpolateBlues } from "d3-scale-chromatic";
import "d3-transition";
import "./Svg.css";

const HeatMap = () => {

    const svgRef = useRef(null);
    const 
        width = 800,
        height = 800,
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        svgWidth = width + margin.left + margin.right,
        svgHeight = height + margin.top + margin.bottom;        

    useEffect(() => {

        const xScale = scaleBand()
            .range([0, width])
            .domain(['s1','s2','s3'])
            .padding(0.01);

        const yScale = scaleBand()
            .range([height, 0])
            .domain(['f1','f2','f3'])
            .padding(0.01);
        
        const svgEl = select(svgRef.current);
        svgEl.selectAll('*').remove();
        const svg = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xAxis = axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);
        //xAxisGroup.select(".domain").remove();
        
        const yAxis = axisLeft(yScale);
        svg.append("g")
            .call(yAxis);
        //yAxisGroup.select(".domain").remove();

        type asdf = Array<[string, string, number]>;

        const data : asdf = [
            ['s1','f1',0.0],
            ['s1','f2',0.3],
            ['s2','f1',0.6],
            ['s2','f2',0.9]
        ];

        const data2 = [
            {solution: 's1', function: 'f1', value: 0.2},
            {solution: 's1', function: 'f2', value: 0.4},
            {solution: 's2', function: 'f1', value: 0.6},
            {solution: 's2', function: 'f2', value: 0.8}
        ]

        svg.selectAll()
            .data(data2)
            .enter()
            .append('rect')
            .attr('x', (data) => xScale(data.solution))
            .attr('y', data => yScale(data.function))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', data => interpolateBlues(data.value))
    });

    //return <div ref={svgRef} id="container" className="svg-container"/>
    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}; 

export default HeatMap;