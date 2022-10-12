// TODO: add support for files to define nadir and ideal vectors
// TODO: add support for files to define which objectives to minimize or maximize

import { csv } from "d3-fetch";
import {
    ScenarioBasedObjectiveValue,
    ScenarioBasedSolutionCollection
} from '../types/ProblemTypes';
import calculateAndSetNadirAndIdealForSolutionCollection from "./calculateNadirAndIdealForSolutionCollection";

/**
 * Reads a CSV file into a ScenarioBasedSolutionCollection. CSV file is assumed to have the following structure:
 *
 * Line 1: solution, scenario, objective id 1, objective id 2, ...
 *
 * Line 2 to infinity: solution id string, scenario id string, numeric value, numeric value...
 *
 * Reads CSV using the csv function from d3-fetch.
 *
 * @return ScenarioBasedSolutionCollection based on contents of read CSV file
 */
export default function readCSVToScenarioBasedSolutionCollection(CSVFileName: string)
{
    const testData = csv(CSVFileName);
    // TODO: should this be renamed?
    let readFileSolutionCollection: ScenarioBasedSolutionCollection = {
        solutions: [],
        objectivesToMaximize: new Map<string, boolean>(),
        objectiveIdeals: new Map<string, number>(),
        objectiveNadirs: new Map<string,  number>(),
        scenarioIds: [],
        objectiveIds: []
    };

    testData.then(data => {
        readFileSolutionCollection.objectiveIds = data.columns.slice(2);
        let readFileSolutionIds: string[] = [];

        for (let i = 0; i < data.length; i++)
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

        for (let i = 0; i < readFileSolutionCollection.objectiveIds.length; i++)
        {
            readFileSolutionCollection.objectivesToMaximize.set(readFileSolutionCollection.objectiveIds[i], false);
            /*
            // TODO: Calculate the actual ideals and nadirs here
            readFileSolutionCollection.objectiveIdeals.set(readFileSolutionCollection.objectiveIds[i], 0);
            readFileSolutionCollection.objectiveNadirs.set(readFileSolutionCollection.objectiveIds[i], 10);
            */
        };

        calculateAndSetNadirAndIdealForSolutionCollection(readFileSolutionCollection);
    });

    console.log('new SolutionCollection read from file.');
    console.log(readFileSolutionCollection);
    return readFileSolutionCollection;
};