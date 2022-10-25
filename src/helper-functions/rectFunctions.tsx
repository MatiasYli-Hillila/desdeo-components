// TODO: Implement using linked list
// TODO: Rename file to something more descriptive (e.g. SB_EAFareaCalculator?)

import { ScenarioBasedSolutionUsingObjectiveVectors } from "../types/ProblemTypes";

export function rectCollision(x1: number, y1: number, x2: number, y2: number): [number, number] | number
{
    if (x1 === x2 && y1 === y2) return 2;
    else if (x1 < x2)
    {
        if (y1 <= y2) return 0;
        else return [x2,y1];
    }
    else
    {
        if (y1 <= y2) return [x1,y2];
        else return 1;
    }
};

// TODO: Rename this function; it calculates rects, not collisions
export function calculateCollisionsForSolution(solution: ScenarioBasedSolutionUsingObjectiveVectors)
{
    let orderedRects: Array<[number, number, number]> = [];
    for(const objectiveVector of solution.objectiveVectors)
    {
        orderedRects.push([objectiveVector.objectiveValues[0], objectiveVector.objectiveValues[1], 0]);
    }
    const zxcv = orderedRects.length;
    for (let i = 0; i < zxcv; i++)
    {
        //const asdf = solution.objectiveVectors[i].objectiveValues;
        const asdf = orderedRects[i];
        //const zxcv = orderedRects.length;
        // if (debug) console.log(zxcv);
        for (let j = i+1; j < zxcv; j++)
        {
            /*
            if(i > 10 || j > 10)
            {
                // if (debug) console.log(`calculateCollisions: too many iterations. i,j: ${i},${j}`);
                return orderedRects;
            }
            */
            //const qwer = solution.objectiveVectors[j].objectiveValues;
            const qwer = orderedRects[j];
            let nextCollision;
            if (asdf[2] === qwer[2]) {nextCollision = rectCollision(asdf[0], asdf[1], qwer[0], qwer[1]);}
            else continue;
            if (nextCollision === 0)
            {
                // if (debug) console.log(`nextCollision === 0. i = ${i}, j = ${j}`);
                orderedRects[j][2]++;
            }
            else if (nextCollision === 1)
            {
                // if (debug) console.log(`nextCollision === 1. i = ${i}, j = ${j}`);
                orderedRects[i][2]++;
            }
            else if (nextCollision === 2)
            {
                // if (debug) console.log(`nextCollision === 2. i = ${i}, j = ${j}`)
                orderedRects[i][2]++; orderedRects[j][2]++;
            }
            else
            {
                if (typeof nextCollision === 'number') continue;
                orderedRects.push([nextCollision[0], nextCollision[1], Math.max(orderedRects[i][2], orderedRects[j][2])+1]);

                //const indeksi = orderedRects.findIndex(d => d[2] === orderedRects[i][2]);
                //const indeksi = orderedRects.lastIndexOf([_,_,orderedRects[i][2]]);
                /*
                let indeksi = i;
                for (let k = orderedRects.length-1; k >= 0; k--)
                {
                    if (orderedRects[k][2] === orderedRects[i][2])
                    {
                        indeksi = k+1;
                        break;
                    }
                }
                //orderedRects.findLastIndex
                orderedRects.splice(indeksi, 0, [nextCollision[0], nextCollision[1], orderedRects[i][2]]);
                for (let k = indeksi; k < orderedRects.length; k++)
                {
                    orderedRects[k][2]++;
                }
                */
            }
        }
    }
    for (let i = zxcv; i < orderedRects.length; i++)
    {
        for (let j = i+1; j < orderedRects.length; j++)
        {
            let nextCollision;
            const asdf = orderedRects[i]; const qwer = orderedRects[j];
            if (asdf[2] === qwer[2]) {nextCollision = rectCollision(asdf[0], asdf[1], qwer[0], qwer[1]);}
            else continue;
            if (nextCollision === 0)
            {
                // if (debug) console.log(`nextCollision === 0. i = ${i}, j = ${j}`);
                orderedRects[j][2]++;
            }
            else if (nextCollision === 1)
            {
                // if (debug) console.log(`nextCollision === 1. i = ${i}, j = ${j}`);
                orderedRects[i][2]++;
            }
            else if (nextCollision === 2)
            {
                // if (debug) console.log(`nextCollision === 2. i = ${i}, j = ${j}`)
                orderedRects[i][2]++; orderedRects[j][2]++;
            }
        }
    }
    return orderedRects.sort((a,b) => a[2]-b[2]);
}