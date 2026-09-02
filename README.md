# Enhancing Your BMI Calculator with Flutter

Project developed at Santander Bootcamp 2023 - Mobile with Flutter, under the guidance of specialist [Danilo Perez](https://github.com/perez-danilo "Danilo Perez").

In this challenge, we will make the BMI Calculator even more comprehensive and professional by applying additional concepts and tools, and by updating the app to include data reading and result display in a list format.

## Features

- **Person model** with validation.
- **Robust BMI logic** with classification and defensive error handling.
- **Form-based input** with validation and friendly error messages.
- **Results list**: each calculation is saved and displayed in a scrollable list.
- **Dismissible entries**: swipe to remove a saved result.
- **Clean, modular Dart code** separated into `person.dart`, `bmi_calculator.dart`, and `main.dart`.

## How to run

1. Run:

    ```bash
    flutter pub get
    flutter run
    ```

2. Use the form to enter weight (kg) and height (m), then tap **Calculate BMI**.
3. Results appear in the list below the form. Swipe an item to delete it.

![BMI Calculator](/docs/assets/BMI_Calculator.png)

## Notes for developers

- The app intentionally keeps dependencies minimal and uses only Flutter SDK components.
- Input parsing accepts both ``.`` and ``,`` as decimal separators in the UI.
- Validation is performed both at the form level (user-friendly messages) and at the model level (exceptions).
- To persist results between sessions, integrate a local storage solution (e.g., ``shared_preferences`` or a local database).
- To add localization, replace hard-coded English strings with Flutter localization (ARB files + ``flutter_localizations``).

## Testing

- Unit tests can be added for ``calculateBmi``, ``classifyBmi``, and ``Person.validate`` using ``flutter_test``.
- Example test targets:
    - Valid BMI calculation for known inputs.
    - Classification boundaries (16, 17, 18.5, 25, 30, 35, 40).
    - Validation errors for zero/negative inputs and non-numeric strings.

[LICENSE](/LICENSE)
