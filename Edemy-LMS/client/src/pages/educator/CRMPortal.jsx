import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';
import Logger from '../../components/Logger';

const CRMPortal = () => {
	const { backendUrl, getToken } = useContext(AppContext);
	const [students, setStudents] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	// Generate comprehensive dummy student data for demo
	const generateDummyStudents = () => {
		return [
			{
				id: '1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				phone: '+1 234-567-8900',
				enrollmentDate: '2024-12-15',
				coursesEnrolled: ['Introduction to JavaScript', 'Web Development Bootcamp'],
				totalCourses: 2,
				progress: 65,
				status: 'Active',
				lastActivity: '2025-01-10',
				country: 'United States'
			},
			{
				id: '2',
				name: 'Jane Smith',
				email: 'jane.smith@example.com',
				phone: '+1 234-567-8901',
				enrollmentDate: '2024-12-20',
				coursesEnrolled: ['Advanced Python Programming', 'Data Science with Python'],
				totalCourses: 2,
				progress: 80,
				status: 'Active',
				lastActivity: '2025-01-12',
				country: 'Canada'
			},
			{
				id: '3',
				name: 'Michael Johnson',
				email: 'michael.j@example.com',
				phone: '+1 234-567-8902',
				enrollmentDate: '2024-11-10',
				coursesEnrolled: ['Cybersecurity Basics', 'Introduction to JavaScript'],
				totalCourses: 2,
				progress: 45,
				status: 'Active',
				lastActivity: '2025-01-08',
				country: 'United Kingdom'
			},
			{
				id: '4',
				name: 'Sarah Williams',
				email: 'sarah.w@example.com',
				phone: '+1 234-567-8903',
				enrollmentDate: '2024-12-25',
				coursesEnrolled: ['Web Development Bootcamp'],
				totalCourses: 1,
				progress: 30,
				status: 'Active',
				lastActivity: '2025-01-11',
				country: 'Australia'
			},
			{
				id: '5',
				name: 'David Brown',
				email: 'david.brown@example.com',
				phone: '+1 234-567-8904',
				enrollmentDate: '2024-10-05',
				coursesEnrolled: ['Cloud Computing Essentials', 'Data Science with Python', 'Advanced Python Programming'],
				totalCourses: 3,
				progress: 90,
				status: 'Active',
				lastActivity: '2025-01-13',
				country: 'Germany'
			},
			{
				id: '6',
				name: 'Emily Davis',
				email: 'emily.davis@example.com',
				phone: '+1 234-567-8905',
				enrollmentDate: '2024-12-30',
				coursesEnrolled: ['Introduction to JavaScript'],
				totalCourses: 1,
				progress: 15,
				status: 'Active',
				lastActivity: '2025-01-05',
				country: 'France'
			}
		];
	};

	const fetchStudents = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get(backendUrl + '/api/educator/crm/students', {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (data.success && data.students && data.students.length > 0) {
				setStudents(data.students);
			} else {
				// Use dummy data for demo
				setStudents(generateDummyStudents());
			}
		} catch (error) {
			// Use dummy data when API fails
			console.log('Using dummy student data for demo');
			setStudents(generateDummyStudents());
		}
	};

	useEffect(() => {
		fetchStudents();
	}, []);

	// CSV Download Function
	const downloadCSV = () => {
		if (!students || students.length === 0) {
			toast.error('No data to export');
			return;
		}

		// Prepare CSV headers
		const headers = [
			'ID',
			'Name',
			'Email',
			'Phone',
			'Country',
			'Enrollment Date',
			'Total Courses',
			'Courses Enrolled',
			'Progress (%)',
			'Status',
			'Last Activity'
		];

		// Prepare CSV rows
		const rows = students.map(student => [
			student.id,
			student.name,
			student.email,
			student.phone,
			student.country,
			student.enrollmentDate,
			student.totalCourses,
			student.coursesEnrolled.join('; '),
			student.progress,
			student.status,
			student.lastActivity
		]);

		// Combine headers and rows
		const csvContent = [
			headers.join(','),
			...rows.map(row => row.map(cell => `"${cell}"`).join(','))
		].join('\n');

		// Create blob and download
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `students_crm_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success('CSV file downloaded successfully!');
	};

	// Filter students based on search term
	const filteredStudents = students?.filter(student =>
		student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		student.phone.includes(searchTerm) ||
		student.country.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	return students ? (
		<div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
			<div className='w-full space-y-5'>
				<div className="block sm:hidden">
					<Logger />
				</div>

				{/* Header with Title and Download Button */}
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
					<div>
						<h1 className='text-2xl md:text-3xl font-bold text-gray-800'>CRM Portal</h1>
						<p className='text-gray-500 mt-1'>Manage and track all student information</p>
					</div>
					<button
						onClick={downloadCSV}
						className='px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2'
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						Download CSV
					</button>
				</div>

				{/* Search Bar */}
				<div className='w-full md:w-96'>
					<input
						type='text'
						placeholder='Search by name, email, phone, or country...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Statistics Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
						<p className='text-gray-500 text-sm'>Total Students</p>
						<p className='text-2xl font-bold text-gray-800 mt-1'>{students.length}</p>
					</div>
					<div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
						<p className='text-gray-500 text-sm'>Active Students</p>
						<p className='text-2xl font-bold text-green-600 mt-1'>
							{students.filter(s => s.status === 'Active').length}
						</p>
					</div>
					<div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
						<p className='text-gray-500 text-sm'>Total Enrollments</p>
						<p className='text-2xl font-bold text-blue-600 mt-1'>
							{students.reduce((sum, s) => sum + s.totalCourses, 0)}
						</p>
					</div>
					<div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
						<p className='text-gray-500 text-sm'>Avg. Progress</p>
						<p className='text-2xl font-bold text-purple-600 mt-1'>
							{Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
						</p>
					</div>
				</div>

				{/* Students Table */}
				<div className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-gray-50 border-b border-gray-200'>
								<tr>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										ID
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Student Name
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Contact
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Country
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Enrollment Date
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Courses
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Progress
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Status
									</th>
									<th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
										Last Activity
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredStudents.length > 0 ? (
									filteredStudents.map((student) => (
										<tr key={student.id} className='hover:bg-gray-50'>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
												{student.id}
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='text-sm font-medium text-gray-900'>{student.name}</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{student.email}</div>
												<div className='text-sm text-gray-500'>{student.phone}</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
												{student.country}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
												{new Date(student.enrollmentDate).toLocaleDateString()}
											</td>
											<td className='px-4 py-3'>
												<div className='text-sm text-gray-900 font-medium'>{student.totalCourses}</div>
												<div className='text-xs text-gray-500 max-w-xs truncate'>
													{student.coursesEnrolled.join(', ')}
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='flex items-center gap-2'>
													<div className='w-16 bg-gray-200 rounded-full h-2'>
														<div
															className='bg-blue-600 h-2 rounded-full'
															style={{ width: `${student.progress}%` }}
														></div>
													</div>
													<span className='text-sm text-gray-900'>{student.progress}%</span>
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<span
													className={`px-2 py-1 text-xs font-medium rounded-full ${
														student.status === 'Active'
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}`}
												>
													{student.status}
												</span>
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
												{new Date(student.lastActivity).toLocaleDateString()}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9} className='px-4 py-8 text-center text-gray-500'>
											No students found matching your search.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Summary */}
				<div className='text-sm text-gray-500'>
					Showing {filteredStudents.length} of {students.length} students
				</div>
			</div>
		</div>
	) : (
		<Loading />
	);
};

export default CRMPortal;

