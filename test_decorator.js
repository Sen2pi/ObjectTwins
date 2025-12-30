import { createActivityInstance } from "./src/core/factory/ActivityFactory.js";

console.log("--- Testing Activity Factory with Decorator ---");

// Case 1: Without Decorator
const config1 = { record_collision_events: false };
const instance1 = createActivityInstance("id1", "Modelagem3D", config1);
const analytics1 = instance1.analyticsForStudent("student1");
const hasCollision1 = analytics1.quantAnalytics.some(m => m.name === 'total_collision_events_registered');
console.log(`Case 1 (No Decorator): Has 'total_collision_events_registered'? ${hasCollision1}`);

// Case 2: With Decorator
const config2 = { record_collision_events: true };
const instance2 = createActivityInstance("id2", "Modelagem3D", config2);
const analytics2 = instance2.analyticsForStudent("student2");
const hasCollision2 = analytics2.quantAnalytics.some(m => m.name === 'total_collision_events_registered');
console.log(`Case 2 (With Decorator): Has 'total_collision_events_registered'? ${hasCollision2}`);

if (!hasCollision1 && hasCollision2) {
    console.log("SUCCESS: Decorator logic works correctly.");
} else {
    console.log("FAILURE: Decorator logic failed.");
}

console.log("\nFull Analytics Structure (With Decorator):");
console.log(JSON.stringify(analytics2, null, 2));
