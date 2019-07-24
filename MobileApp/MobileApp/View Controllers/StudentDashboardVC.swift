//
//  StudentDashboardVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class StudentDashboardVC: UIViewController {

    var authenticatedUser: User? = nil
    
    @IBAction func LogoutButton(sender: AnyObject) {
        self.navigationController?.popToRootViewController(animated: true)
    }
}

