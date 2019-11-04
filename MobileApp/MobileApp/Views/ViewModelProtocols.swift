//
//  ViewModelProtocols.swift
//  MobileApp
//
//  Created by Ben Hollar on 8/1/19.
//  Copyright © 2019 Ben Hollar. All rights reserved.
//

import Foundation

protocol ListViewDelegate {
    
    func refreshData()
    
    func deleteRow(at indices: IndexSet)
    
}
