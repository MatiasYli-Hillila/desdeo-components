import {
    ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray
} from "../types/ProblemTypes";

export default function calculateAndSetNadirAndIdealForSolutionCollectionUsingObjectiveVectorsArray(
    solutionCollection: ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray)
    {
        var newNadirs = new Map<string, number>();
        var newIdeals = new Map<string, number>();

        // Initialize to worst case scenario
        for (const objectiveId of solutionCollection.objectiveIds)
        {
            const maximize: boolean = solutionCollection.objectivesToMaximize.get(objectiveId)!;
            newNadirs.set(objectiveId, maximize ? Infinity : -Infinity);
            newIdeals.set(objectiveId, maximize ? -Infinity : Infinity);
        }

        for (const solution of solutionCollection.solutions)
        {
            for (const objectiveVector of solution.objectiveVectors)
            {
                let i = 0;
                for(const objectiveId of solutionCollection.objectiveIds)
                {
                    const currentNadir = newNadirs.get(objectiveId)!;
                    const currentIdeal = newIdeals.get(objectiveId)!;
                    const maximize: boolean = solutionCollection.objectivesToMaximize.get(objectiveId)!;
                    const nextValue = objectiveVector.objectiveValues[i];
                    if ((maximize && nextValue < currentNadir) || (!maximize && nextValue > currentNadir)
                    ) newNadirs.set(objectiveId, nextValue);
                    if ((maximize && nextValue > currentIdeal) || (!maximize && nextValue < currentIdeal)
                    ) newIdeals.set(objectiveId, nextValue);
                    i++;
                }

            }
        }
        solutionCollection.objectiveNadirs = newNadirs;
        solutionCollection.objectiveIdeals = newIdeals;
        //console.log('calculateNadirIdealForVectors');
        //console.log(solutionCollection.objectiveIdeals);
    };