# 1+2. QA Payment Assignment 
# Clone the repository:
# git clone <https://github.com/shira011/QA-Payment-Assignment-.git>
# Install dependencies:
# npm ci
# Install Playwright browsers:
# npx playwright install --with-deps
# Run Tests:
# npx playwright test
# npx playwright test tests/api/createPaymentProcess.spec.ts
3. The three scenarios:
1. positive flow that gets all the parameters correctly and returns 200 status.
2. Missing item with a proper message response.
3. Wrong input for a must-field.
All are the most common and critical use cases. When we make these tests automated, we make sure that these important scenarios are covered.
4.I would choose Docker to ensures environment consistency, which is critical for API tests that depend on specific Node.js versions, dependencies... By containerizing the tests, you can run them locally, in CI/CD pipelines, or on any server without worrying about mismatched environments.



