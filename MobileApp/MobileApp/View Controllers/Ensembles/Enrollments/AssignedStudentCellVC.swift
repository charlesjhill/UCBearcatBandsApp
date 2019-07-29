//
//  AssignedStudentCellVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/29/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class AssignedStudentCellVC: UIViewController {
    
    var student: Student
    var switchVisibility: Bool = true {
        didSet { selectionSwitch?.isHidden = !switchVisibility }
    }
    var isSelected: Bool {
        get { return selectionSwitch?.isOn ?? true }
        set { selectionSwitch?.isOn = newValue }
    }
    
    @IBOutlet private var bigLabel: UILabel?
    @IBOutlet private var detailLabel: UILabel?
    @IBOutlet private var selectionSwitch: UISwitch?
    
    init(student: Student) {
        self.student = student
        super.init(nibName: "AssignedStudentCell", bundle: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        bigLabel?.text = student.user.fullName
        detailLabel?.text = student.mNumber
        selectionSwitch?.isHidden = !switchVisibility
        isSelected = false
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public func changeColors(backgroundColor: UIColor = .white, fontColor: UIColor = .black) {
        view.backgroundColor = backgroundColor
        bigLabel?.textColor = fontColor
        detailLabel?.textColor = fontColor
    }
    
}

extension Array where Element == AssignedStudentCellVC {
    
    func getAssignedStudents() -> [Student] {
        var students: [Student] = []
        for vc in self {
            if vc.switchVisibility && vc.isSelected { students.append(vc.student) }
        }
        return students
    }
    
}
