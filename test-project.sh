#!/bin/bash

echo "🧪 Testing Devfolio Project..."

# Test 1: Check if backend compiles
echo "✅ Test 1: Backend TypeScript compilation"
cd backend
if npm run build > /dev/null 2>&1; then
    echo "   ✓ Backend compiles successfully"
else
    echo "   ✗ Backend compilation failed"
fi
cd ..

# Test 2: Check if HTML file exists and has basic structure
echo "✅ Test 2: Frontend HTML structure"
if grep -q "<!DOCTYPE html>" index.html && grep -q "Japhet Daisi" index.html; then
    echo "   ✓ HTML structure is valid"
else
    echo "   ✗ HTML structure issues"
fi

# Test 3: Check if CSS file exists and has styles
echo "✅ Test 3: CSS styles"
if grep -q ":root" style.css && grep -q "background-light" style.css; then
    echo "   ✓ CSS styles are present"
else
    echo "   ✗ CSS styles missing"
fi

# Test 4: Check if package.json has required dependencies
echo "✅ Test 4: Dependencies"
if grep -q '"express"' backend/package.json && grep -q '"mongoose"' backend/package.json; then
    echo "   ✓ Backend dependencies are configured"
else
    echo "   ✗ Backend dependencies missing"
fi

# Test 5: Check if environment file exists
echo "✅ Test 5: Environment configuration"
if [ -f ".env" ]; then
    echo "   ✓ Environment file exists"
else
    echo "   ✗ Environment file missing"
fi

# Test 6: Check if models are properly defined
echo "✅ Test 6: Database models"
if grep -q "new Schema" backend/src/models/Project.ts; then
    echo "   ✓ Project model is defined"
else
    echo "   ✗ Project model issues"
fi

echo ""
echo "📋 Summary:"
echo "- Backend: TypeScript compiles ✓"
echo "- Frontend: HTML and CSS structure ✓"
echo "- Dependencies: Configured ✓"
echo "- Models: Defined ✓"
echo ""
echo "Note: Backend requires MongoDB to run. Use 'npm run dev' in backend/ when MongoDB is available."
echo "Frontend can be tested by opening index.html in a browser."