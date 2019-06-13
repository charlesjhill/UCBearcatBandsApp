//
//  StudentDataAccessing.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/12/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import typealias Alamofire.Parameters

protocol StudentDataAccessing {
    
    /// The common format of a completion handler for student retrieval requests
    typealias StudentsRetrievedHandler = ((_ students: [Student]?) -> Void)?
    
    /// Searches for students matching the given search terms
    ///
    /// - Parameters:
    ///   - searchTerms: A Parameters dictionary supplying search terms. Currently, valid options include:
    ///     - search: A String to search for in the students
    ///     - ordering: The ordering to be done, specified by a string of the element to search by
    func searchForStudents(searchTerms: Parameters, completion: StudentsRetrievedHandler)
    
    /// Requests and loads all available students
    ///
    /// - Parameters:
    ///   - completion: An optional completion handler to deal with the result of the query
    func loadAllStudents(completion: StudentsRetrievedHandler)
    
    /// Adds a Student to the database
    ///
    /// - TODO:
    ///   - consider adding a return or completion handler to handle success/failure reporting
    ///
    /// - Parameters:
    ///   - student: The Student to be added
    func addStudent(student: Student)
    
    /// Adds a Student to the database
    ///
    /// - TODO:
    ///   - consider adding a return or completion handler to handle success/failure reporting
    ///
    /// - Parameters:
    ///   - firstName: The first name of the Student
    ///   - lastName: The last name of the Student
    ///   - mNumber: The UC identification number of the student, beginning with an M
    func addStudent(firstName: String, lastName: String, mNumber: String)
    
    /// Edits a student that currently exists in the database.
    ///
    /// - TODO:
    ///   - consider adding a return or completion handler to handle success/failure reporting
    ///
    /// - Parameters:
    ///   - student: The Student to be modified; must include a valid (non-nil) ID
    ///   - params: A Paramaters dictionary defining the values to replace in the student. Can be obtained via
    ///     Student.toDictionary()
    func editStudent(student: Student, params: Parameters)
    
    /// Deletes a student from the database.
    ///
    /// - TODO:
    ///   - consider adding a return or completion handler to handle success/failure reporting
    ///
    /// - Parameters:
    ///   - student: The Student to be deleted; must include a valid (non-nil) ID
    func deleteStudent(student: Student)
    
}
