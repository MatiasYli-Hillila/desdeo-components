// TODO: Add support for files to define nadir and ideal vectors

import { csv } from "d3-fetch";
import {
    ScenarioBasedObjectiveValue,
    ScenarioBasedSolutionCollectionUsingObjectiveValuesArray
} from '../types/ProblemTypes';
import calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveValuesArray
    from "./calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveValuesArray";

/**
 * Reads a CSV file into a *ScenarioBasedSolutionCollectionUsingObjectiveValuesArray*.
 * All objectives are currently assumed to be minimized. Uses the csv function from d3-fetch.
 *
 * ---
 *
 * CSV file is assumed to have the following structure:
 *
 * * Line 1: solution, scenario, objective id 1, objective id 2, ...
 *
 *     * solution and scenario are expected in all lowercase
 *
 * * Line 2 to infinity: solution id string, scenario id string, numeric value, numeric value...
 *
 * ---
 *
 * @return a *ScenarioBasedSolutionCollectionUsingObjectiveValuesArray* based on contents of read CSV file
 */
export default function readCSVToScenarioBasedSolutionCollectionUsingObjectiveValuesArray(CSVFileName: string)
{
    console.group('csvValuesArray, outside async');
    const csvData = csv(CSVFileName);
    console.log(csvData);
    // TODO: Should this be renamed?
    let readFileSolutionCollection: ScenarioBasedSolutionCollectionUsingObjectiveValuesArray = {
        solutions: [],
        objectivesToMaximize: new Map<string, boolean>(),
        objectiveIdeals: new Map<string, number>(),
        objectiveNadirs: new Map<string,  number>(),
        scenarioIds: [],
        objectiveIds: []
    };

    csvData.then(data => {
        console.group('csvValuesArray, inside async')
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
                console.log(`Row zero, value ${i}:`)
                console.log(rowZeroValues[i]);
                switch(rowZeroValues[i])
                {
                    case '1': beingMaximized = false;
                    break;

                    case 'min': beingMaximized = false;
                    break;

                    case '-1': beingMaximized = true;
                    break;

                    case 'max': beingMaximized = true;
                    break;

                    default:
                    console.warn('Warning: Wrongly formatted min/max information while reading csv to ObjValuesArray.');
                    beingMaximized = true;
                }

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
                readFileSolutionCollection.solutions.push({solutionId: currentSolutionId, objectiveValues: []});
            }
            for (let j = 0; j < readFileSolutionCollection.objectiveIds.length; j++)
            {
                let currentObjectiveId: string = readFileSolutionCollection.objectiveIds![j];
                let newObjectiveValue: ScenarioBasedObjectiveValue = {
                    scenarioId: currentScenarioId,
                    objectiveId: currentObjectiveId,
                    objectiveValue: Number(data[i][currentObjectiveId])
                };
                readFileSolutionCollection
                .solutions
                .find(item => item.solutionId === currentSolutionId)!
                .objectiveValues
                .push(newObjectiveValue);
            };
        };

        calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveValuesArray(readFileSolutionCollection);
        console.groupEnd();
    });

    console.log(readFileSolutionCollection);
    console.groupEnd();
    return readFileSolutionCollection;
};