// TODO: Add support for files to define nadir and ideal vectors
// TODO: Add support for files to define which objectives to minimize or maximize?

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
 * Line 1: solution, scenario, objective id 1, objective id 2, ...
 *
 * Line 2 to infinity: solution id string, scenario id string, numeric value, numeric value...
 *
 * ---
 *
 * @return a *ScenarioBasedSolutionCollectionUsingObjectiveValuesArray* based on contents of read CSV file
 */
export default function readCSVToScenarioBasedSolutionCollectionUsingObjectiveValuesArray(CSVFileName: string)
{
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
        readFileSolutionCollection.objectiveIds = data.columns.slice(2);
        let readFileSolutionIds: string[] = [];

        let zeroOrOne = 0;
        if (data[0].solution === '-1' || data[0].solution === '1')
        {
            zeroOrOne = 1;
            const rowZeroValues = Object.values(data[0])
            for (let i = 0; i < readFileSolutionCollection.objectiveIds.length; i++)
            {
                let beingMaximized = false;
                console.log(rowZeroValues[i]);
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
    });

    return readFileSolutionCollection;
};