import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

// The condition of satisfaction says that “the user can add a new grade
// for an existing student,” but it does not fully specify the behavior
// of addGrade in several important cases.

// Underspecified case #1:
// If addGrade is called for a course that already has a grade for the
// same student, it is unclear whether the new grade should overwrite
// the existing grade, throw an error, or allow duplicate entries.

// Underspecified case #2:
// If addGrade is called with a student ID that does not exist, the
// specification does not say whether the function should throw an error
// (like getTranscript), fail silently, or ignore the request.

// Underspecified case #3:
// The specification does not state whether a student can have multiple
// grades for the same course, or whether each course may appear only once
// in a transcript.

// Because these behaviors are not specified, different implementations
// of addGrade could all satisfy the stated condition of satisfaction.





// First test checks that adding a grade for an existing student succeeds (no error thrown
// “the user can add a new grade for an existing student.”
// They use only methods exposed by TranscriptService.
// They will currently fail (because addGrade / getGrade are unimplemented),

describe('addGrade', () => {
  it('should add a grade for an existing student without throwing an error', () => {
    const id = db.addStudent('blair');

    expect(() =>
      db.addGrade(id, 'CS4530' as any, 'A' as any)
    ).not.toThrow();
  });

  // First test checks that adding a grade for an existing student succeeds (no error thrown).
  // Second test checks that the grade addition has an observable effect (it can be retrieved afterward).
  // they use only methods exposed by TranscriptService

  it('should allow the added grade to be retrieved for an existing student and course', () => {
    const id = db.addStudent('blair');

    db.addGrade(id, 'CS4530' as any, 'A' as any);

    expect(db.getGrade(id, 'CS4530' as any)).toEqual('A');
  });
});

// the two tests 

describe('addGrade', () => {
  it('should add a grade for an existing student without throwing an error', () => {
    const id = db.addStudent('blair');

    expect(() => db.addGrade(id, 'CS4530' as any, 'A' as any)).not.toThrow();
  });

  it('should allow the added grade to be retrieved for an existing student and course', () => {
    const id = db.addStudent('blair');

    db.addGrade(id, 'CS4530' as any, 'A' as any);

    expect(db.getGrade(id, 'CS4530' as any)).toEqual('A');
  });

  it('should allow adding grades for multiple different courses for the same existing student', () => {
    const id = db.addStudent('blair');

    db.addGrade(id, 'CS4530' as any, 'A' as any);
    db.addGrade(id, 'CS2510' as any, 'B' as any);

    expect(db.getGrade(id, 'CS4530' as any)).toEqual('A');
    expect(db.getGrade(id, 'CS2510' as any)).toEqual('B');
  });

  it('should allow adding grades for two different existing students independently', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');

    db.addGrade(id1, 'CS4530' as any, 'A' as any);
    db.addGrade(id2, 'CS4530' as any, 'C' as any);

    expect(db.getGrade(id1, 'CS4530' as any)).toEqual('A');
    expect(db.getGrade(id2, 'CS4530' as any)).toEqual('C');
  });
});



