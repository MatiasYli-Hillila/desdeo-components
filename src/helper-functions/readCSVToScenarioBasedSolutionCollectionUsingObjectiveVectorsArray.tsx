// TODO: Add support for files to define nadir and ideal vectors

import { csv } from "d3-fetch";
import {
    ScenarioBasedObjectiveVector,
    ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray
} from '../types/ProblemTypes';
import calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray
    from "./calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray";
//import { calculateCollisionsForSolution } from "./rectFunctions";

/**
 * Reads a CSV file into a *ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray*.
 * All objectives are currently assumed to be minimized. Uses the csv function from d3-fetch.
 *
 * ---
 *
 * CSV file is assumed to have the following structure:
 *
 * Line 1: solution, scenario, objective id 1, objective id 2, ...
 *
 * Line 2 to infinity: solution id string, scenario id string, numeric value, numeric value...
 *
 * ---
 *
 * @return *ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray* based on contents of read CSV file
 */
export default function readCSVToScenarioBasedSolutionCollectionUsingObjectiveVectorsArray(CSVFileName: string)
{
    console.group('csvVectorArray, outside async');
    const csvData = csv(CSVFileName);
    // TODO: Should this be renamed?
    let readFileSolutionCollection: ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray = {
        solutions: [],
        objectivesToMaximize: new Map<string, boolean>(),
        objectiveIdeals: new Map<string, number>(),
        objectiveNadirs: new Map<string,  number>(),
        scenarioIds: [],
        objectiveIds: []
    };

    csvData.then(data => {
        console.group('csvVectorArray, inside async')
        console.log('VectorReader data:');
        console.log(data);
        readFileSolutionCollection.objectiveIds = data.columns.slice(2);
        if (data[0].solution === undefined)
        {
            throw new Error(`Error reading ${CSVFileName}: first line of file does not contain word 'solution' in lowercase.`);
        }
        let readFileSolutionIds: string[] = [];
        let zeroOrOne = 0;
        const rowZeroValues = Object.values(data[0]);

        if (/^(1|min|-1|max)$/.test(data[0].solution) && rowZeroValues[rowZeroValues.length-1] === '')
        {
            zeroOrOne = 1;

            for (let i = 0; i < readFileSolutionCollection.objectiveIds.length; i++)
            {
                let beingMaximized = false;
                if (rowZeroValues[i] === '-1') beingMaximized = true;
                else if (rowZeroValues[i] === '1') beingMaximized = false;
                else console.warn('Warning: Wrongly formatted min/max information while reading csv to ObjValuesArray.');
                readFileSolutionCollection.objectivesToMaximize.set(readFileSolutionCollection.objectiveIds[i], beingMaximized);
            };
        }
        else
        {
            for (let i = 0; i < readFileSolutionCollection.objectiveIds.length; i++)
            {
                readFileSolutionCollection.objectivesToMaximize.set(readFileSolutionCollection.objectiveIds[i], false);
            }
        };

        for (let i = zeroOrOne; i < data.length; i++)
        {
            let currentSolutionId = data[i].solution!;
            let currentScenarioId = data[i].scenario!;
            if (!readFileSolutionCollection.scenarioIds.includes(currentScenarioId))
            {
                readFileSolutionCollection.scenarioIds.push(currentScenarioId);
            }
            if (!readFileSolutionIds.includes(currentSolutionId))
            {
                readFileSolutionIds.push(currentSolutionId);
                readFileSolutionCollection.solutions.push({solutionId: currentSolutionId, objectiveVectors: []});
            }

            let newObjectiveVector: ScenarioBasedObjectiveVector = {
                scenarioId: currentScenarioId,
                objectiveValues: new Array<number>(readFileSolutionCollection.objectiveIds.length)
            };
            let j = 0;
            for (const objectiveId of readFileSolutionCollection.objectiveIds)
            {
                newObjectiveVector.objectiveValues[j] = Number(data[i][objectiveId]);
                j++;
            };
            readFileSolutionCollection.solutions.at(-1)!.objectiveVectors.push(newObjectiveVector);
        };

        // TODO: Update this if min/max info is added to objectives
        for (let i = 0; i < readFileSolutionCollection.objectiveIds.length; i++)
        {
            readFileSolutionCollection.objectivesToMaximize.set(readFileSolutionCollection.objectiveIds[i], false);
        };

        calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray(readFileSolutionCollection);
        console.groupEnd();
    });

    console.groupEnd();
    return readFileSolutionCollection;
};