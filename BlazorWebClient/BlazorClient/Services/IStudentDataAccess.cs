using BlazorClient.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlazorClient.Services
{
    internal interface IStudentDataAccess
    {
        /// <summary>
        /// Get all students
        /// </summary>
        /// <returns></returns>
        Task<Student[]> GetStudents();

        /// <summary>
        /// Get all students using some query parameters
        /// </summary>
        /// <param name="queryParams"></param>
        /// <returns></returns>
        Task<Student[]> GetStudents(Dictionary<string, string> queryParams);

        /// <summary>
        /// Retrieve a student with a given id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<Student> RetrieveStudent(int id);

        /// <summary>
        /// Add a student and generate its ID
        /// </summary>
        /// <param name="student"></param>
        Task AddStudent(Student student);

        /// <summary>
        /// Update a student with new information
        /// </summary>
        /// <param name="student"></param>
        Task UpdateStudent(Student student);

        /// <summary>
        /// Delete a student
        /// </summary>
        /// <param name="student"></param>
        Task DeleteStudent(Student student);

        /// <summary>
        /// Delete a student with a given ID
        /// </summary>
        /// <param name="id"></param>
        Task DeleteStudent(int id);
    }
}
