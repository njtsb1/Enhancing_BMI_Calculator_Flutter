import 'package:flutter/material.dart';
import 'person.dart';
import 'bmi_calculator.dart';

void main() {
  runApp(const BmiApp());
}

class BmiApp extends StatelessWidget {
  const BmiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BMI Calculator',
      theme: ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const BmiHomePage(),
    );
  }
}

class BmiHomePage extends StatefulWidget {
  const BmiHomePage({super.key});

  @override
  State<BmiHomePage> createState() => _BmiHomePageState();
}

class _BmiHomePageState extends State<BmiHomePage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();

  final List<_Entry> _entries = [];

  bool _isDark = true;

  @override
  void dispose() {
    _nameController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _toggleTheme() {
    setState(() => _isDark = !_isDark);
  }

  /// Parse a numeric string that may use comma or dot as decimal separator.
  double? _parseNumber(String input) {
    final s = input.trim().replaceAll(',', '.');
    return double.tryParse(s);
  }

  void _onCalculate() {
    // Clear previous error messages by validating form.
    if (!_formKey.currentState!.validate()) return;

    final name = _nameController.text.trim();
    final weight = _parseNumber(_weightController.text);
    final height = _parseNumber(_heightController.text);

    try {
      if (weight == null || height == null) {
        throw FormatException('Weight and height must be numeric.');
      }

      final person = Person(
        name: name,
        weightKg: weight,
        heightM: height,
      );

      // validate will throw if invalid
      person.validate();

      final result = computeBmiResult(person);

      setState(() {
        _entries.insert(
          0,
          _Entry(
            person: person,
            result: result,
            timestamp: DateTime.now(),
          ),
        );
      });

      // Optionally clear inputs but keep name for convenience
      _weightController.clear();
      _heightController.clear();

      // Provide a short success feedback
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('BMI calculated: ${result.bmi.toStringAsFixed(1)}')),
      );
    } on FormatException catch (e) {
      _showError(e.message);
    } on RangeError catch (e) {
      _showError(e.message ?? 'Invalid numeric range.');
    } catch (e) {
      _showError('Unexpected error: ${e.toString()}');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
      ),
    );
  }

  void _onClearAll() {
    setState(() {
      _entries.clear();
    });
  }

  void _onRemoveEntry(int index) {
    setState(() {
      _entries.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = _isDark ? ThemeData.dark() : ThemeData.light();
    return Theme(
      data: theme.copyWith(useMaterial3: true),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('BMI Calculator'),
          actions: [
            IconButton(
              tooltip: 'Toggle theme',
              icon: Icon(_isDark ? Icons.dark_mode : Icons.light_mode),
              onPressed: _toggleTheme,
            ),
            IconButton(
              tooltip: 'Clear all results',
              icon: const Icon(Icons.delete_sweep),
              onPressed: _entries.isEmpty ? null : _onClearAll,
            ),
          ],
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                _buildForm(),
                const SizedBox(height: 12),
                _buildHeader(),
                const SizedBox(height: 8),
                Expanded(child: _buildList()),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Name (optional)
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Name (optional)',
                  prefixIcon: Icon(Icons.person),
                ),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 8),
              // Weight
              TextFormField(
                controller: _weightController,
                decoration: const InputDecoration(
                  labelText: 'Weight (kg)',
                  hintText: 'e.g. 72.5',
                  prefixIcon: Icon(Icons.monitor_weight),
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  final v = value ?? '';
                  final parsed = _parseNumber(v);
                  if (parsed == null) return 'Enter a valid number for weight.';
                  if (parsed <= 0) return 'Weight must be greater than zero.';
                  return null;
                },
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 8),
              // Height
              TextFormField(
                controller: _heightController,
                decoration: const InputDecoration(
                  labelText: 'Height (m)',
                  hintText: 'e.g. 1.75',
                  prefixIcon: Icon(Icons.height),
                ),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  final v = value ?? '';
                  final parsed = _parseNumber(v);
                  if (parsed == null) return 'Enter a valid number for height.';
                  if (parsed <= 0) return 'Height must be greater than zero.';
                  return null;
                },
                onFieldSubmitted: (_) => _onCalculate(),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: FilledButton.tonal(
                      onPressed: () {
                        _weightController.clear();
                        _heightController.clear();
                      },
                      child: const Text('Clear'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      onPressed: _onCalculate,
                      child: const Text('Calculate BMI'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        const Expanded(
          child: Text(
            'Results',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
        ),
        Text(
          '${_entries.length} saved',
          style: const TextStyle(color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildList() {
    if (_entries.isEmpty) {
      return const Center(
        child: Text(
          'No results yet. Enter weight and height to calculate BMI.',
          textAlign: TextAlign.center,
        ),
      );
    }

    return ListView.separated(
      itemCount: _entries.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final entry = _entries[index];
        return Dismissible(
          key: ValueKey(entry.timestamp.toIso8601String()),
          direction: DismissDirection.endToStart,
          background: Container(
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            color: Colors.redAccent,
            child: const Icon(Icons.delete, color: Colors.white),
          ),
          onDismissed: (_) => _onRemoveEntry(index),
          child: Card(
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.indigo,
                child: Text(
                  entry.result.bmi.toStringAsFixed(1),
                  style: const TextStyle(fontSize: 12, color: Colors.white),
                ),
              ),
              title: Text(entry.person.name.isEmpty ? 'Anonymous' : entry.person.name),
              subtitle: Text(
                '${entry.person.weightKg} kg • ${entry.person.heightM} m\n${entry.result.classification}',
              ),
              isThreeLine: true,
              trailing: Text(
                _formatTime(entry.timestamp),
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ),
          ),
        );
      },
    );
  }

  String _formatTime(DateTime t) {
    final hh = t.hour.toString().padLeft(2, '0');
    final mm = t.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }
}

class _Entry {
  final Person person;
  final BmiResult result;
  final DateTime timestamp;

  _Entry({
    required this.person,
    required this.result,
    required this.timestamp,
  });
}
