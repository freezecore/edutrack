"""
EduTrack Unit Tests – Verification Matrix (VAL-01 to VAL-04)
Run with:  python test_edutrack.py
"""

import unittest
import os
import json

# Import from the main module
from edutrack import Student, get_honours_list, save_database, load_database, DB_FILE


class TestEduTrack(unittest.TestCase):

    def setUp(self):
        """Create a fresh student before every test."""
        self.student = Student("S001", "Alice", "alice@edu.com")

    # ── VAL-01: Malformed grade input ──────────────────────────────────────
    def test_val01_malformed_grade_raises_value_error(self):
        """Non-numeric string must raise ValueError, not crash."""
        with self.assertRaises(ValueError):
            self.student.add_grade("Math", "not-a-number")

    def test_val01_grade_below_range_raises_value_error(self):
        """Score below 0.0 must raise ValueError."""
        with self.assertRaises(ValueError):
            self.student.add_grade("Math", -5)

    def test_val01_grade_above_range_raises_value_error(self):
        """Score above 100.0 must raise ValueError."""
        with self.assertRaises(ValueError):
            self.student.add_grade("Math", 105)

    # ── VAL-02: Attendance duplicate isolation ─────────────────────────────
    def test_val02_duplicate_attendance_stored_once(self):
        """Submitting the same date twice records only one entry."""
        self.student.mark_attendance("2024-01-15")
        self.student.mark_attendance("2024-01-15")
        self.assertEqual(len(self.student.attendance), 1)

    def test_val02_different_dates_both_stored(self):
        """Two distinct dates are both recorded."""
        self.student.mark_attendance("2024-01-15")
        self.student.mark_attendance("2024-01-16")
        self.assertEqual(len(self.student.attendance), 2)

    # ── VAL-03: GPA calculation accuracy ──────────────────────────────────
    def test_val03_gpa_with_100_and_50_equals_3_00(self):
        """Scores of 100 and 50 → average 75 → GPA = 3.00 exactly."""
        self.student.add_grade("Math", 100)
        self.student.add_grade("English", 50)
        self.assertAlmostEqual(self.student.calculate_gpa(), 3.00, places=2)

    def test_val03_perfect_scores_give_4_00_gpa(self):
        """All 100s → GPA = 4.00."""
        self.student.add_grade("Math", 100)
        self.student.add_grade("Science", 100)
        self.assertAlmostEqual(self.student.calculate_gpa(), 4.00, places=2)

    def test_val03_no_grades_gives_0_00_gpa(self):
        """No grades → GPA = 0.00."""
        self.assertAlmostEqual(self.student.calculate_gpa(), 0.00, places=2)

    # ── VAL-04: Graceful serialisation ────────────────────────────────────
    def test_val04_save_and_reload_preserves_state(self):
        """Saving and loading should reconstruct student state accurately."""
        self.student.enrol_course("Physics")
        self.student.add_grade("Physics", 85)
        self.student.mark_attendance("2024-03-01")

        registry = {"S001": self.student}

        # Save
        save_database(registry)
        self.assertTrue(os.path.exists(DB_FILE))

        # Reload
        loaded_registry = load_database()
        loaded = loaded_registry.get("S001")

        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.name, "Alice")
        self.assertIn("Physics", loaded.courses)
        self.assertIn("2024-03-01", loaded.attendance)
        self.assertIsInstance(loaded.attendance, set)   # must be a set, not list
        self.assertAlmostEqual(loaded.calculate_gpa(), (85 / 100) * 4.0, places=2)

    def tearDown(self):
        """Clean up test database file."""
        if os.path.exists(DB_FILE):
            os.remove(DB_FILE)

    # ── Extra: Honours list filter ─────────────────────────────────────────
    def test_honours_list_filters_correctly(self):
        """Only students with GPA ≥ 3.5 appear in the honours list."""
        self.student.add_grade("Math", 90)   # GPA = 3.6 → qualifies
        low = Student("S002", "Bob", "bob@edu.com")
        low.add_grade("Math", 60)            # GPA = 2.4 → does not qualify

        registry = {"S001": self.student, "S002": low}
        honours = get_honours_list(registry)

        self.assertEqual(len(honours), 1)
        self.assertEqual(honours[0].name, "Alice")

    # ── Extra: Private grade encapsulation ────────────────────────────────
    def test_private_grades_not_directly_accessible(self):
        """__grades must not be accessible via student.__grades."""
        with self.assertRaises(AttributeError):
            _ = self.student.__grades

    # ── Extra: Grade curve capped at 100 ──────────────────────────────────
    def test_curve_does_not_exceed_100(self):
        """Applying a large bonus must never push any grade past 100."""
        self.student.add_grade("Art", 95)
        self.student.apply_curve(20)
        grades = self.student.get_grades()
        self.assertLessEqual(grades["Art"], 100.0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
