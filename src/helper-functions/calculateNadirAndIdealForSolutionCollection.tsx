import {
    ScenarioBasedSolutionCollection
} from "../types/ProblemTypes";

export default function calculateAndSetNadirAndIdealForSolutionCollection(solutionCollection: ScenarioBasedSolutionCollection)
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
        for(const objectiveValue of solution.objectiveValues)
        {
            const objectiveId = objectiveValue.objectiveId;
            const nextValue = objectiveValue.objectiveValue;
            const currentNadir = newNadirs.get(objectiveId)!;
            const currentIdeal = newIdeals.get(objectiveId)!;
            const maximize: boolean = solutionCollection.objectivesToMaximize.get(objectiveValue.objectiveId)!;
            // TODO: what should the indentation here be?
            if ((maximize && nextValue < currentNadir) || (!maximize && nextValue > currentNadir)
            ) newNadirs.set(objectiveId, nextValue);
            else if ((maximize && nextValue > currentIdeal) || (!maximize && nextValue < currentIdeal)
            ) newIdeals.set(objectiveId, nextValue);
        }
    }

    solutionCollection.objectiveNadirs = newNadirs;
    solutionCollection.objectiveIdeals = newIdeals;
};