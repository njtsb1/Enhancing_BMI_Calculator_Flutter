import 'dart:math';
import 'person.dart';

class BmiResult {
  final double bmi;
  final String classification;

  BmiResult({
    required this.bmi,
    required this.classification,
  });

  @override
  String toString() => '${bmi.toStringAsFixed(1)} — $classification';
}

/// Calculate BMI for a Person instance.
/// Throws [FormatException] or [RangeError] if input is invalid.
double calculateBmi(Person person) {
  person.validate();
  final w = person.weightKg;
  final h = person.heightM;
  if (h == 0) throw RangeError('Height cannot be zero.');
  final bmi = w / (h * h);
  // Round to one decimal place for display consistency.
  return (bmi * 10).roundToDouble() / 10.0;
}

/// Classify BMI using standard thresholds.
/// Returns a human-friendly English label.
String classifyBmi(double bmi) {
  if (bmi.isNaN || bmi.isInfinite) {
    throw FormatException('Invalid BMI value.');
  }
  if (bmi < 16) return 'Severe Thinness';
  if (bmi >= 16 && bmi < 17) return 'Moderate Thinness';
  if (bmi >= 17 && bmi < 18.5) return 'Mild Thinness';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  if (bmi >= 30 && bmi < 35) return 'Obesity Class I';
  if (bmi >= 35 && bmi < 40) return 'Obesity Class II (Severe)';
  return 'Obesity Class III (Morbid)';
}

/// Convenience: compute BmiResult for a Person.
BmiResult computeBmiResult(Person person) {
  final bmi = calculateBmi(person);
  final classification = classifyBmi(bmi);
  return BmiResult(bmi: bmi, classification: classification);
}
