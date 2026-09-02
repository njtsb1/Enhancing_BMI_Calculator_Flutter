class Person {
  final String name;
  final double weightKg;
  final double heightM;

  Person({
    required this.name,
    required this.weightKg,
    required this.heightM,
  });

  /// Validate fields and throw descriptive exceptions on invalid input.
  void validate() {
    if (name.trim().isEmpty) {
      // name is optional in the app, so we don't throw for empty name.
      return;
    }
    if (weightKg.isNaN || heightM.isNaN) {
      throw FormatException('Weight and height must be numeric.');
    }
    if (weightKg <= 0) {
      throw RangeError('Weight must be greater than zero.');
    }
    if (heightM <= 0) {
      throw RangeError('Height must be greater than zero.');
    }
  }

  @override
  String toString() => '$name — ${weightKg}kg / ${heightM}m';
}
