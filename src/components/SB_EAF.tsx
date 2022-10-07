import { select } from "d3-selection";
import { useEffect, useState, useRef } from "react";

import "./Svg.css";

interface SB_EAFProps {
    
}

const SB_EAF = () => {
    const ref = useRef(null);
    
    useEffect(() => {
        const svgContainer = select(ref.current);
        svgContainer.selectAll('*').remove();
    
        const svg = svgContainer
        .append('svg')
        .classed('svg-content', true)
        .attr('width', 400)
        .attr('height', 400);
        
        //#region overlap test 1
        svg//.selectAll()
        //.append('g')
        .append('rect')
        .attr('width', 200)
        .attr('height', 50)
        .attr('x', 0)
        .attr('y', 0)
        .style('fill', 'black')
        .style('opacity', 0.5);
        
        svg
        .append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', 100)
        .attr('y', 0)
        .style('fill', 'red')
        .style('opacity', 0.5);
        
        svg
        .append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', 200)
        .attr('y', 0)
        .style('fill', 'black')
        .style('opacity', 0.5);
        
        svg
        .append('rect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', 300)
        .attr('y', 0)
        .style('fill', 'red')
        .style('opacity', 0.5);
        
        svg
        .append("circle")
        .attr("cx", 150 )
        .attr("cy", 25 )
        .attr("r", 2)
        .style("fill", "yellow")

        svg
        .append('text')
        .attr('x', 150)
        .attr('y', 15)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(() => 'Scenario 1')
        .style('fill', 'black')
        
        //#endregion

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
    });
    
    return <div ref={ref} id="container" className="component-container"/>
};

export default SB_EAF;