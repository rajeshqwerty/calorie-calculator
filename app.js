// Simplified and Robust Calorie Calculator
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Calorie Calculator...');
    
    // Get form elements
    const form = document.getElementById('calorieForm');
    const resultsSection = document.getElementById('resultsSection');
    const errorContainer = document.getElementById('errorMessages');
    
    // Input elements
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const activitySelect = document.getElementById('activityLevel');
    
    // Ensure results are hidden initially
    if (resultsSection) {
        resultsSection.style.display = 'none';
        resultsSection.classList.add('hidden');
        resultsSection.classList.remove('show');
    }
    
    // Hide error container initially
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.classList.add('hidden');
    }
    
    console.log('Initial setup complete - all fields should be empty');
    
    // Form submit handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            handleFormSubmit();
        });
    }
    
    function handleFormSubmit() {
        console.log('Processing form submission...');
        
        // Get form values
        const age = ageInput ? parseFloat(ageInput.value) : null;
        const height = heightInput ? parseFloat(heightInput.value) : null;
        const weight = weightInput ? parseFloat(weightInput.value) : null;
        const activity = activitySelect ? parseFloat(activitySelect.value) : null;
        const genderElement = document.querySelector('input[name="gender"]:checked');
        const gender = genderElement ? genderElement.value : null;
        
        console.log('Form values:', { age, height, weight, activity, gender });
        
        // Validate inputs
        const errors = validateInputs(age, height, weight, activity, gender);
        
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }
        
        // Hide errors if validation passes
        hideErrors();
        
        // Perform calculations
        performCalculations(age, height, weight, activity, gender);
    }
    
    function validateInputs(age, height, weight, activity, gender) {
        const errors = [];
        
        // Reset error styling
        clearErrorStyling();
        
        // Validate age
        if (!age || isNaN(age) || age < 10 || age > 120) {
            errors.push('Please enter a valid age between 10 and 120 years');
            if (ageInput) ageInput.style.borderColor = 'red';
        }
        
        // Validate height
        if (!height || isNaN(height) || height < 100 || height > 250) {
            errors.push('Please enter a valid height between 100 and 250 cm');
            if (heightInput) heightInput.style.borderColor = 'red';
        }
        
        // Validate weight
        if (!weight || isNaN(weight) || weight < 30 || weight > 300) {
            errors.push('Please enter a valid weight between 30 and 300 kg');
            if (weightInput) weightInput.style.borderColor = 'red';
        }
        
        // Validate gender
        if (!gender) {
            errors.push('Please select your gender');
            const genderButtons = document.querySelectorAll('.gender-button');
            genderButtons.forEach(btn => btn.style.borderColor = 'red');
        }
        
        // Validate activity level
        if (!activity || isNaN(activity)) {
            errors.push('Please select your activity level');
            if (activitySelect) activitySelect.style.borderColor = 'red';
        }
        
        console.log('Validation complete. Errors:', errors.length);
        return errors;
    }
    
    function clearErrorStyling() {
        if (ageInput) ageInput.style.borderColor = '';
        if (heightInput) heightInput.style.borderColor = '';
        if (weightInput) weightInput.style.borderColor = '';
        if (activitySelect) activitySelect.style.borderColor = '';
        
        const genderButtons = document.querySelectorAll('.gender-button');
        genderButtons.forEach(btn => btn.style.borderColor = '');
    }
    
    function showErrors(errors) {
        if (errorContainer && errors.length > 0) {
            errorContainer.innerHTML = errors.map(error => 
                `<div class="error-message" style="color: red; margin: 4px 0;">${error}</div>`
            ).join('');
            errorContainer.style.display = 'block';
            errorContainer.classList.remove('hidden');
            
            // Scroll to errors
            errorContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function hideErrors() {
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.classList.add('hidden');
            errorContainer.innerHTML = '';
        }
    }
    
    function performCalculations(age, height, weight, activity, gender) {
        console.log('Starting calculations with:', { age, height, weight, activity, gender });
        
        try {
            // Calculate BMR using Mifflin-St Jeor equation
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            
            // Calculate TDEE
            const tdee = bmr * activity;
            const maintenanceCalories = Math.round(tdee);
            
            // Calculate BMI
            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            
            console.log('Calculations complete:', { bmr, tdee, maintenanceCalories, bmi });
            
            // Display results
            displayResults(bmi, maintenanceCalories, weight);
            
            // Show results section
            showResultsSection();
            
        } catch (error) {
            console.error('Calculation error:', error);
            showErrors(['An error occurred during calculation. Please try again.']);
        }
    }
    
    function displayResults(bmi, maintenanceCalories, weight) {
        console.log('Displaying results...');
        
        // BMI Results
        const bmiValueEl = document.getElementById('bmiValue');
        const bmiCategoryEl = document.getElementById('bmiCategory');
        const bmiAdviceEl = document.getElementById('bmiAdvice');
        
        if (bmiValueEl) bmiValueEl.textContent = bmi.toFixed(1);
        
        // BMI Category
        let category, color, advice;
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3498db';
            advice = 'Consider consulting a healthcare provider about healthy weight gain';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            color = '#27ae60';
            advice = 'Maintain your current healthy weight with balanced nutrition';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f39c12';
            advice = 'Consider gradual weight loss through diet and exercise';
        } else {
            category = 'Obese';
            color = '#e74c3c';
            advice = 'Consult a healthcare provider for a comprehensive weight management plan';
        }
        
        if (bmiCategoryEl) {
            bmiCategoryEl.textContent = category;
            bmiCategoryEl.style.backgroundColor = color;
            bmiCategoryEl.style.color = 'white';
        }
        if (bmiAdviceEl) bmiAdviceEl.textContent = advice;
        
        // Health Information
        const waterIntakeEl = document.getElementById('waterIntake');
        const proteinNeedsEl = document.getElementById('proteinNeeds');
        
        if (waterIntakeEl) {
            const waterLiters = (weight * 35 / 1000).toFixed(1);
            waterIntakeEl.textContent = `${waterLiters}L per day`;
        }
        
        if (proteinNeedsEl) {
            const proteinMin = Math.round(weight * 0.8);
            const proteinMax = Math.round(weight * 1.2);
            proteinNeedsEl.textContent = `${proteinMin}-${proteinMax}g per day`;
        }
        
        // Calorie Goals
        displayCalorieGoals(maintenanceCalories);
        
        // Macronutrients
        displayMacronutrients(maintenanceCalories);
        
        console.log('All results displayed successfully');
    }
    
    function displayCalorieGoals(maintenanceCalories) {
        // Maintenance
        const maintainEl = document.getElementById('maintainCalories');
        if (maintainEl) maintainEl.textContent = `${maintenanceCalories} cal/day`;
        
        // Weight Loss (ensure minimum 1200 calories)
        const mildLossEl = document.getElementById('mildLossCalories');
        const weightLossEl = document.getElementById('weightLossCalories');
        const extremeLossEl = document.getElementById('extremeLossCalories');
        
        if (mildLossEl) mildLossEl.textContent = `${Math.max(1200, maintenanceCalories - 250)} cal/day`;
        if (weightLossEl) weightLossEl.textContent = `${Math.max(1200, maintenanceCalories - 500)} cal/day`;
        if (extremeLossEl) extremeLossEl.textContent = `${Math.max(1200, maintenanceCalories - 1000)} cal/day`;
        
        // Weight Gain
        const slowGainEl = document.getElementById('slowGainCalories');
        const moderateGainEl = document.getElementById('moderateGainCalories');
        const fastGainEl = document.getElementById('fastGainCalories');
        
        if (slowGainEl) slowGainEl.textContent = `${maintenanceCalories + 250} cal/day`;
        if (moderateGainEl) moderateGainEl.textContent = `${maintenanceCalories + 500} cal/day`;
        if (fastGainEl) fastGainEl.textContent = `${maintenanceCalories + 1000} cal/day`;
    }
    
    function displayMacronutrients(maintenanceCalories) {
        // Protein (25% of calories, 4 cal/g)
        const proteinCals = Math.round(maintenanceCalories * 0.25);
        const proteinGrams = Math.round(proteinCals / 4);
        
        // Carbs (45% of calories, 4 cal/g)
        const carbCals = Math.round(maintenanceCalories * 0.45);
        const carbGrams = Math.round(carbCals / 4);
        
        // Fats (30% of calories, 9 cal/g)
        const fatCals = Math.round(maintenanceCalories * 0.30);
        const fatGrams = Math.round(fatCals / 9);
        
        // Update display
        const proteinCaloriesEl = document.getElementById('proteinCalories');
        const proteinGramsEl = document.getElementById('proteinGrams');
        const carbCaloriesEl = document.getElementById('carbCalories');
        const carbGramsEl = document.getElementById('carbGrams');
        const fatCaloriesEl = document.getElementById('fatCalories');
        const fatGramsEl = document.getElementById('fatGrams');
        
        if (proteinCaloriesEl) proteinCaloriesEl.textContent = `${proteinCals} calories`;
        if (proteinGramsEl) proteinGramsEl.textContent = `${proteinGrams} grams`;
        if (carbCaloriesEl) carbCaloriesEl.textContent = `${carbCals} calories`;
        if (carbGramsEl) carbGramsEl.textContent = `${carbGrams} grams`;
        if (fatCaloriesEl) fatCaloriesEl.textContent = `${fatCals} calories`;
        if (fatGramsEl) fatGramsEl.textContent = `${fatGrams} grams`;
    }
    
    function showResultsSection() {
        if (resultsSection) {
            resultsSection.style.display = 'grid';
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('show');
            
            // Scroll to results
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
            console.log('Results section displayed');
        }
    }
    
    // Clear error styling when user starts typing
    [ageInput, heightInput, weightInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        }
    });
    
    if (activitySelect) {
        activitySelect.addEventListener('change', function() {
            this.style.borderColor = '';
        });
    }
    
    // Clear gender error styling
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        input.addEventListener('change', function() {
            const genderButtons = document.querySelectorAll('.gender-button');
            genderButtons.forEach(btn => btn.style.borderColor = '');
        });
    });
    
    console.log('Calorie Calculator initialized successfully');
});

// Simple keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.matches('input[type="number"]')) {
        const form = document.getElementById('calorieForm');
        if (form) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Button feedback
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        e.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});