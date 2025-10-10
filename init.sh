set -e
mkdir -p public
mkdir -p src/assets
mkdir -p src/styles
mkdir -p src/utils
mkdir -p src/store
mkdir -p src/routes
mkdir -p src/components/ui
mkdir -p src/components/employees
mkdir -p src/components/batch
mkdir -p src/components/tax
mkdir -p src/pages/Dashboard
mkdir -p src/pages/EmployeeManagement
mkdir -p src/pages/TaxSettings
mkdir -p src/pages/EmployeeCalculator
mkdir -p src/pages/BatchProcessing
mkdir -p src/pages/Auth
mkdir -p src/pages/NotFound

touch index.html README.md package.json postcss.config.cjs tailwind.config.cjs vite.config.js .env.example
touch src/index.jsx src/App.jsx src/Routes.jsx
touch src/styles/tailwind.css
touch src/utils/format.js src/utils/math.js src/utils/constants.js
touch src/store/index.js src/store/slices.js
touch src/components/ui/Card.jsx src/components/ui/Button.jsx src/components/ui/Input.jsx
touch src/components/employees/EmployeeForm.jsx src/components/employees/EmployeeTable.jsx
touch src/components/batch/BatchConfigurator.jsx src/components/batch/BatchRunner.jsx src/components/batch/BatchResults.jsx
touch src/components/tax/TaxBracketInfo.jsx src/components/tax/TaxSettingsPanel.jsx
touch src/pages/Dashboard/index.jsx
touch src/pages/EmployeeManagement/index.jsx
touch src/pages/TaxSettings/index.jsx
touch src/pages/EmployeeCalculator/index.jsx
touch src/pages/BatchProcessing/index.jsx
touch src/pages/Auth/Login.jsx src/pages/Auth/Register.jsx
touch src/pages/NotFound/index.jsx

echo "Structure du projet SALARYGN créée."
