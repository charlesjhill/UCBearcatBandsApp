//
//  UniformCellVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class UniformCellVC: UIViewController {
    
    let uniform: UniformPiece
    
    @IBOutlet private var bigLabel: UILabel?
    @IBOutlet private var detailLabel: UILabel?
    
    init(_ u: UniformPiece) {
        uniform = u
        super.init(nibName: "UniformCell", bundle: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        bigLabel?.text = uniform.name
        detailLabel?.text = uniform.kind.rawValue
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
