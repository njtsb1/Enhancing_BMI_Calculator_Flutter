import 'package:test/test.dart';
import 'package:bmi_calculator/person.dart';
import 'package:bmi_calculator/bmi_calculator.dart';

void main() {
  group('BmiCalculator', () {
    test('calculates BMI correctly', () {
      final bmi = BmiCalculator.calculateBmi(70, 1.75);
      expect(bmi, closeTo(22.8571, 0.0001));
    });

    test('classifies healthy BMI', () {
      final classification = BmiCalculator.classify(22.0);
      expect(classification, equals('Healthy'));
    });

    test('classifies severe thinness', () {
      expect(BmiCalculator.classify(15.5), equals('Severe thinness'));
    });

    test('computeForPerson returns BmiResult', () {
      final person = Person(name: 'Alice', weightKg: 80, heightM: 1.8);
      final result = BmiCalculator.computeForPerson(person);
      expect(result.bmi, closeTo(24.6913, 0.0001));
      expect(result.classification, equals('Healthy'));
    });

    test('person constructor rejects non-positive values', () {
      expect(() => Person(name: 'X', weightKg: 0, heightM: 1.7), throwsArgumentError);
      expect(() => Person(name: 'Y', weightKg: 70, heightM: 0), throwsArgumentError);
    });
  });
}
