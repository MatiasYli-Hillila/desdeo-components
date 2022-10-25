// TODO: Add support for files to define nadir and ideal vectors
// TODO: Add support for files to define which objectives to minimize or maximize?

import { csv } from "d3-fetch";
import {
    ScenarioBasedObjectiveVector,
    ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray
} from '../types/ProblemTypes';
import calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray
    from "./calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray";
import { calculateCollisionsForSolution } from "./rectFunctions";

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

        /*
        const asdf = readFileSolutionCollection.solutions[0];
        if (asdf !== undefined) {
            console.log('readFileSolutionCollection.solutions:');
            console.log(readFileSolutionCollection.solutions);
            console.log(`Entering calculateCollisionsForSolution for asdf:`);
            console.log(asdf);
            const qwer = calculateCollisionsForSolution(asdf);
            console.log('readCSV vectors, rects:');
            console.log(qwer);
        }
        */
    });



    return readFileSolutionCollection;
};