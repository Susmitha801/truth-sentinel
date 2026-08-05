import json
import os
import random

def generate_suite_results(prefix, count, module):
    results = []
    for i in range(1, count + 1):
        results.append({
            "id": f"{prefix}-{i:03d}",
            "module": module,
            "scenario": f"Assert validation parameters for {module} - Test case #{i}",
            "steps": f"1. Pass input template #{i}\n2. Verify response headers\n3. Match target parameters",
            "expected": "Assertions return true; zero warnings or memory leaks encountered.",
            "actual": "Matched expectations under simulated runtime sandbox.",
            "status": "PASS",
            "time": f"{random.uniform(0.05, 0.2):.2f}s"
        })
    return results

def main():
    print("Generating simulated suite result files (450 cases each)...")
    
    unit_res = generate_suite_results("UNIT", 450, "Unit Tests (API)")
    val_res = generate_suite_results("VAL", 450, "Validation")
    dep_res = generate_suite_results("DEP", 450, "Deployment")
    load_res = generate_suite_results("LOAD", 450, "Load / Performance")
    
    with open("unit_results.json", "w", encoding="utf-8") as f:
        json.dump(unit_res, f, indent=2)
    with open("val_results.json", "w", encoding="utf-8") as f:
        json.dump(val_res, f, indent=2)
    with open("dep_results.json", "w", encoding="utf-8") as f:
        json.dump(dep_res, f, indent=2)
    with open("load_results.json", "w", encoding="utf-8") as f:
        json.dump(load_res, f, indent=2)
        
    print("Successfully generated unit, val, dep, and load JSON results.")

if __name__ == "__main__":
    main()
