//
//  AdminPortalVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/16/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class AdminPortalVC: UIViewController {
    var menuShow = false
    
    @IBOutlet weak var LeadingConstraint: NSLayoutConstraint!
    
    override func viewDidLoad() {
        let db = SampleDatabasePopulation()
        db.populate()
    }
    
    @IBAction func openMenu(_ sender: Any) {
    if (menuShow) {
        LeadingConstraint.constant = -150
    }
    else {
        LeadingConstraint.constant = 0
        UIView.animate(withDuration: 0.2, delay: 0.0, options: .curveEaseIn, animations: {
            self.view.layoutIfNeeded()
        })
    }
    menuShow = !menuShow
    }

}
